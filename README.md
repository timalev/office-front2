# OfficeFront2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



статья по маршрутизации - https://metanit.com/web/angular2/7.1.php
создание нового проекта - https://code.tutsplus.com/ru/creating-your-first-angular-app-basics--cms-30092t
подключение модулей без файлов модулей - https://metanit.com/web/angular2/6.1.php

1. Страница с регистрацией и авторизацией сотрудников и админов.
2. Для админа страница со списком сотрудников и их группами. На этой странице должна быть возможность редактировать/создавать/удалять группы и добавлять в них сотрудников.
3. Карта офиса (на бэкенде будут координаты столов и переговорных, поэтому на странице в соответствии с этими координатами должны быть нарисованы прямоугольники). На бэкенде будет сохранено количество мониторов на столе, если 0 - ничего, если 1 - на столе должна быть иконка монитора, если 2 и более - множественная иконка.
4. При нажатии на стол/переговорную должна открываться форма для бронирования/отмены бронирования. Для столов (рабочих мест) в форме нужно выбрать день бронирования. Для переговорных - день, время и имена других сотрудников (если бронирование совместное). Бронирование возможно только в тех офисах, к которым относится группа, в которую входит сотрудник.
5. Занятые на выбранный день места должны отображаться на карте более бледным цветом.
6. Забронированные сотрудником места должны отображаться на карте контрастным цветом.
7. Всё рабочие места должны быть пронумерованы, а переговорные - иметь названия.
8. При нажатии на забронированное другим сотрудником место должно появляться предупреждение о невозможности бронирования.
9. Страница с информацией о загруженности офиса в конкретный день (процентное отношение забронированных столов к всему количеству)
10. Админ должен обладать графическим интерфейсом. При нажатии на кнопку "Создать рабочее место/переговорную" должна появляться форма, куда он введёт координаты данного стола и количество мониторов. Получаем ответ от бэкенда. Если успешно, рисуем стол на нужном месте. Иначе сообщаем об ошибке. Также редактор может мышкой передвигать столы. И, соответственно, удалять
