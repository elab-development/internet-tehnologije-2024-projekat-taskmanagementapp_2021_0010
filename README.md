# Task Management App

Ovaj projekat je veb aplikacija za upravljanje zadacima, razvijena kao Single Page Application (SPA). Omogućava korisnicima organizaciju obaveza kroz liste i kategorije uz potpunu kontrolu nad statusima i prioritetima.

## Opis funkcionalnosti

Aplikacija nudi sledeće ključne funkcionalnosti:

- Upravljanje korisnicima: Registracija, prijava i bezbedna autentifikacija putem tokena.
- Organizacija: Kreiranje personalizovanih listi zadataka i kategorija.
- Upravljanje zadacima: Kompletan CRUD (kreiranje, prikaz, izmena i brisanje) zadataka.
- Automatizacija: SQL Triger koji automatski beleži svaku promenu statusa zadatka u posebnu tabelu za logove (audit log).
- Pretraga i filtriranje: Dinamička pretraga zadataka i filtriranje po statusu, prioritetu ili kategoriji.
- Dashboard: Prikaz statistike i zadataka kojima uskoro ističe rok.

## Tehnologije

- Backend: Laravel 11 (PHP)
- Frontend: React.js
- Baza podataka: MySQL
- Autentifikacija: Laravel Sanctum

## Implementirani REST principi

Projekat prati RESTful principe kroz:
- Korišćenje odgovarajućih HTTP metoda: GET, POST, PUT, DELETE.
- Ugnježdene rute za resurse:
    - /api/v1/task-lists/{id}/tasks (Zadaci unutar liste)
    - /api/v1/task-categories/{id}/tasks (Zadaci unutar kategorije)
- Stateless arhitekturu bez korišćenja sesija na serverskoj strani.

## Bezbednost

Aplikacija implementira zaštitu od čestih napada:
- IDOR zaštita: Svaki upit u bazi proverava vlasništvo nad resursom koristeći Auth::id().
- SQL Injection: Korišćenje Eloquent ORM-a i pripremljenih upita (prepared statements).
- Mass Assignment: Zaštita modela kroz definisane $fillable nizove.

## Instalacija i pokretanje


### Backend
1. Kloniranje repozitorijum sa GitHub-a:
   git clone [https://github.com/elab-development/internet-tehnologije-2024-projekat-taskmanagementapp_2021_0010](https://github.com/elab-development/internet-tehnologije-2024-projekat-taskmanagementapp_2021_0010)
2.Podesavanje env-a
3.Instaliranje php zavisnosti: composer install
4.Pokretanje migracija: php artisan migrate

### Frontend
1. Uđite u folder frontend: cd frontend
2. Instalirajte pakete: npm install
3. Pokrenite aplikaciju: npm start

