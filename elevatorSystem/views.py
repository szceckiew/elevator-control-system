from django.shortcuts import render

def homepage(request):
    return render(request, 'home.html')


def building(request, elevatorsAmount, floorsAmount):
    settings = {
        'elevatorsAmount': elevatorsAmount,
        'floorsAmount': floorsAmount,
    }
    return render(request, 'building.html', settings)