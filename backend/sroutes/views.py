from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from decimal import Decimal
from .models import BusRoute, Fare, PassPlan, UserTypeDiscount
from .serializers import BusRouteSerializer, PassPlanSerializer


class BusRouteListView(generics.ListCreateAPIView):
    queryset = BusRoute.objects.all()
    serializer_class = BusRouteSerializer


class BusRouteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BusRoute.objects.all()
    serializer_class = BusRouteSerializer


# ----------------------
# Fare Estimation & Passes
# ----------------------

DEFAULT_BASE_FARE = Decimal('20.00')
MINIMUM_FARE = Decimal('10.00')
TRANSFER_FEE = Decimal('10.00')  # policy: per transfer (can be 0 for first transfer free)
FIRST_TRANSFER_FREE = True


def get_route_base_fare(route_id: int) -> Decimal:
    try:
        f = Fare.objects.filter(route_id=route_id).first()
        return f.amount if f else DEFAULT_BASE_FARE
    except Exception:
        return DEFAULT_BASE_FARE


def get_user_discount(user_type: str) -> Decimal:
    try:
        d = UserTypeDiscount.objects.filter(user_type=user_type).first()
        return d.discount_pct if d else Decimal('0.00')
    except Exception:
        return Decimal('0.00')


@api_view(['GET'])
def fare_estimate(request):
    try:
        route_id = request.GET.get('route_id')
        transfers = int(request.GET.get('transfers', '0'))
        user_type = request.GET.get('user_type', 'default')

        if not route_id:
            return Response({'error': 'route_id is required'}, status=400)

        base = get_route_base_fare(route_id)

        transfer_charge = Decimal('0.00')
        if transfers > 0:
            effective_transfers = transfers - 1 if FIRST_TRANSFER_FREE else transfers
            if effective_transfers > 0:
                transfer_charge = TRANSFER_FEE * Decimal(effective_transfers)

        subtotal = base + transfer_charge
        discount_pct = get_user_discount(user_type)
        discount_amt = (subtotal * discount_pct).quantize(Decimal('0.01'))
        total = max(MINIMUM_FARE, (subtotal - discount_amt).quantize(Decimal('0.01')))

        return Response({
            'route_id': int(route_id),
            'user_type': user_type,
            'breakdown': {
                'base_fare': str(base),
                'transfer_fare': str(transfer_charge),
                'discount_pct': str(discount_pct),
                'discount_amount': str(discount_amt),
                'subtotal': str(subtotal),
            },
            'total': str(total)
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
def passes_options(request):
    try:
        plans = PassPlan.objects.all().order_by('price')
        return Response(PassPlanSerializer(plans, many=True).data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
def passes_quote(request):
    try:
        trips_per_day = Decimal(str(request.data.get('trips_per_day', '0')))
        user_type = request.data.get('user_type', 'default')
        per_trip_cost = Decimal(str(request.data.get('per_trip_cost', DEFAULT_BASE_FARE)))

        if trips_per_day <= 0:
            return Response({'error': 'trips_per_day must be > 0'}, status=400)

        discount_pct = get_user_discount(user_type)
        effective_trip_cost = (per_trip_cost * (Decimal('1.00') - discount_pct)).quantize(Decimal('0.01'))

        # Compute break-even for each pass
        rec = []
        for plan in PassPlan.objects.all():
            if plan.period == 'daily':
                daily_cost = plan.price
                be_trips = (daily_cost / effective_trip_cost).quantize(Decimal('0.01'))
                rec.append({'plan': plan.name, 'period': plan.period, 'price': str(plan.price), 'break_even_trips_per_day': str(be_trips)})
            elif plan.period == 'weekly':
                weekly_cost = plan.price
                be_trips_per_day = (weekly_cost / (effective_trip_cost * Decimal('7'))).quantize(Decimal('0.01'))
                rec.append({'plan': plan.name, 'period': plan.period, 'price': str(plan.price), 'break_even_trips_per_day': str(be_trips_per_day)})
            elif plan.period == 'monthly':
                monthly_cost = plan.price
                be_trips_per_day = (monthly_cost / (effective_trip_cost * Decimal('30'))).quantize(Decimal('0.01'))
                rec.append({'plan': plan.name, 'period': plan.period, 'price': str(plan.price), 'break_even_trips_per_day': str(be_trips_per_day)})

        # Pick recommendation closest to user's trips_per_day
        def pick(plan):
            try:
                return abs(Decimal(plan['break_even_trips_per_day']) - trips_per_day)
            except Exception:
                return Decimal('9999')

        best = min(rec, key=pick) if rec else None

        return Response({
            'user_type': user_type,
            'per_trip_cost': str(effective_trip_cost),
            'plans': rec,
            'recommendation': best
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)
