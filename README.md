# elevator-control-system
Implementacja systemu kontroli wind w budynku napisana w JavaScript.
Do testowania i używania systemu stworzyłem również aplikację webową korzystając z Django.

![image](https://github.com/szceckiew/elevator-control-system/assets/115181486/1d8df572-d5d1-49fc-9ca0-b18148ee6cfc)

![image](https://github.com/szceckiew/elevator-control-system/assets/115181486/4883223d-2c7a-420b-bc62-362a4de06d44)

## Uruchomienie
Wystarczy uruchomić środowisko wirtualne, pobrać Django:

`pip install django `

i wykonać komendę:

`py manage.py runserver`

z głównego katalogu projektu.

## Algorytm
W przypadku naciśnięcia przycisku na piętrze: system zawsze wybiera najbliższą windę, jeżeli ta spełnia jeden z warunków:
1. Winda stoi.
2. Winda ma piętro "po drodze", to znaczy w - dużym uproszczeniu - że nie będzie musiała zmieniać kierunku jazdy by obsłużyć kolejnego użytkownika.

Bardzo ważny jest kierunek, w którym chce jechać użytkownik:
Jeżeli winda jest na 1 piętrze i pierwszy użytkownik będzie chciał jechać w górę na 3 piętrze, to przypisana do tego winda będzie mogła obsłużyć nowego użytkownika tylko wtedy, jeżeli znajduje się on niżej niż użytkownik pierwszy i też będzie chciał jechać w górę.

Inny przykład:
Jeżeli winda jest na 1 piętrze i pierwszy użytkownik będzie chciał jechać w doł na 3 piętrze, to przypisana do tego winda nie będzie mogła obsłużyć nowego użytkownika, ponieważ nie ważne na którym piętrze by on się znajdował i w którą stronę jechał winda mogłaby (nie wiemy, na które piętro chce jechać nowy użytkownik - znamy tylko kierunek) lub musiałaby zmienić kierunek.

W przypadku remisu co do odległości naciśnięcie obsłuży winda o najmniejszym id.
Warto dodać, że ilość pięter, na których zatrzyma się dana winda, wpływa również w małym stopniu na "odległość".

Każda winda zatrzymuje się na piętrze na 2 kroki symulacji.

W przypadku naciśnięcia piętra w windzie: są one priorytetem dla systemu, ponieważ z góry narzucamy, która winda i na jakie piętro.
Tutaj winda również obsłuży takie naciśnięcie, jeżeli 
1. Winda stoi.
   
   lub
2. Winda ma "po drodze".
W przeciwnym wypadku winda spróbuje obsłużyć to naciśnięcie w kolejnym kroku symulacji.

Każde przypisanie obsługiwanych naciśnięć zajmuje 1 krok symulacji.

## System
### Zmienne
Wszystkie informacje przechowywane są w następujących zmiennych:
![image](https://github.com/szceckiew/elevator-control-system/assets/115181486/39c68430-bcb6-479c-816a-9d2250eab5e4)

#### waitTime
Ilość kroków którą czeka winda na piętrze.

#### stopCost
Jaka "odległość" ma być dodana za każdy przypisany już przystanek danej windzie.

#### numElevators
Ilość wind.

#### numFloors
Ilość pięter.

#### elevators
Tablica wszystkich wind.
Zapisane są w niej pozycje, kierunki, kierunki pierwszych naciśnięć, na jakich piętrach zatrzymają się windy, ile mają jeszcze czekać windy na danych piętrach, jakie są wciśnięte przyciski w każdej z wind.

#### callQueue
Tablica wszystkich naciśnięć na piętrach. Są w niej nie przypisane jeszcze naciśnięcia.

### Metody

#### Update'y
![image](https://github.com/szceckiew/elevator-control-system/assets/115181486/25a76f2c-cb2c-43ed-9239-3c65585cfd67)

Zajmują się zmienianiem danych w zmiennych.

---

#### pickup()
![image](https://github.com/szceckiew/elevator-control-system/assets/115181486/6c67bb9e-b691-40c8-beea-f6ac1b550f74)

Dodaje do tablicy callQueue nowe zapytanie.

---

#### _insideButtonPressedCheck(elevatorId)
Sprawdza czy jakieś przyciski w windzie są nieobsłużone i przypisuje je jeżeli jest taka możliwość.

---

#### step()
Wykonuje krok symulacji. Przypisuje naciśnięcia do wind i porusza nimi.

---

#### status()
Zwraca stan wszystkich wind.

---

#### _assignElevator(floor, direction)
Wybiera która winda jest najbliższa danego naciśnięcia spełniając wspomniane wcześniej warunki.


## GUI
home.html i main.js służą jedynie do ustalenia ilości wind i pięter w budynku (ilość jest walidowana).

building.html i building.js generują budynek i zapewniają interakcję z sumulacją (interaktywne pola są walidowane).





