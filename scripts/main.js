(function ($) {
  "use strict";

  let app = (function appController() {
    let $tbody = $("tbody").get();
    return {
      init: function init() {
        this.companyInfo();
        this.initEvents();
        this.allCars();
      },
      companyInfo: function companyInfo() {
        let ajax = new XMLHttpRequest();
        ajax.open("GET", "company.json", true);
        ajax.send();
        ajax.addEventListener("readystatechange", this.getCompanyInfo, false);
      },

      getCompanyInfo: function getCompanyInfo() {
        if (!app.isReady.call(this)) return;

        let $companyName = $("h1").get();
        let $companyPhone = $("h4").get();
        let data = JSON.parse(this.responseText);
        $companyName.textContent = data.name;
        $companyPhone.innerHTML = data.phone;
      },
      isReady: function isReady() {
        return this.readyState === 4 && this.status === 200;
      },
      initEvents: function initEvents() {
        $('[data-js="carRegistration"]').on("submit", this.handleSubmit);
      },
      handleSubmit: function handleSubmit(event) {
        event.preventDefault();
        let fieldValue = app.inputFields();

        let ajax = new XMLHttpRequest();
        ajax.open("POST", "http://localhost:3000/car", true);
        ajax.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
        ajax.send(
          "image=" +
            fieldValue.$imageURL +
            "&makeModel=" +
            fieldValue.$make +
            "&year=" +
            fieldValue.$year +
            "&plate=" +
            fieldValue.$plate +
            "&color=" +
            fieldValue.$color
        );

        ajax.addEventListener(
          "readystatechange",
          function () {
            if (app.isReady.call(this)) {
              let response = JSON.parse(this.responseText);
              if (response.message === "success") {
                $tbody.innerHTML = "";
                app.allCars();
              } else {
                alert(response.message);
              }
            }
            app.clearFields();
          },
          false
        );
      },
      allCars: function allCars() {
        let ajax = new XMLHttpRequest();
        ajax.open("GET", "http://localhost:3000/car", true);
        ajax.send();
        ajax.addEventListener("readystatechange", this.carsDetails, false);
      },
      carsDetails: function () {
        if (app.isReady.call(this)) {
          let cars;
          cars = JSON.parse(this.responseText);


          $tbody.appendChild(app.displayCars(cars));
        }
      },
      displayCars: function displayCars(cars) {
        let $fragment = document.createDocumentFragment();
        let $trowChildren;
        cars.forEach(function (car) {
          let $trow = document.createElement("tr");
          let $tdImage = document.createElement("td");
          $tdImage.className = "image";
          let $image = app.getImage(car.image);

          let $tdMakeModel = document.createElement("td");
          let $tdYear = document.createElement("td");
          let $tdPlate = document.createElement("td");
          let $tdColor = document.createElement("td");
          let $tdDelete = document.createElement("td");

          $tdDelete.addEventListener("click", app.deleteCarFrontend, false);

          $tdImage.appendChild($image);
          $tdMakeModel.textContent = car.makeModel;
          $tdYear.textContent = car.year;
          $tdPlate.textContent = car.plate;
          $tdColor.textContent = car.color;
          $tdDelete.appendChild(app.getDeleteIcon());

          $trowChildren = app.addTableData($trow, [
            $tdImage,
            $tdMakeModel,
            $tdYear,
            $tdPlate,
            $tdColor,
            $tdDelete,
          ]);

          $fragment.appendChild($trowChildren);
        });

        $fragment.removeChild($trowChildren);
        $fragment.appendChild($trowChildren);
        return $fragment;
      },

      addTableData: function addTableData(trow, elements) {
        for (let element of elements) {
          trow.appendChild(element);
        }
        return trow;
      },

      clearFields: function clearFields() {
        app.inputFields().$imageURL = "";
        app.inputFields().$make = "";
        app.inputFields().$year = "";
        app.inputFields().$plate = "";
        app.inputFields().$color = "";
      },
      inputFields: function inputFields() {
        return {
          $imageURL: $('[type="url"]').get().value,
          $make: $('[data-js="make"]').get().value,
          $year: $('[data-js="year"]').get().value,
          $plate: $('[data-js="plate"]').get().value,
          $color: $('[data-js="color"]').get().value,
        };
      },
      getImage: function getImage(url) {
        let $image = document.createElement("img");
        $image.setAttribute("src", url);
        return $image;
      },
      getDeleteIcon: function getDeleteIcon() {
        let i = document.createElement("i");
        i.textContent = "delete";
        i.className = "material-icons";
        return i;
      },
      deleteCarFrontend: function deleteCarFrontend() {
        let tr = this.parentNode;
        tr.remove(this);
        let plateNumber =
          tr.lastElementChild.previousElementSibling.previousElementSibling
            .textContent;
        app.deleteCarBackend(plateNumber);
      },
      deleteCarBackend: function deleteCarBackend(plateNumber) {
        let plate = plateNumber;
        let ajax = new XMLHttpRequest();
        ajax.open("DELETE", "http://localhost:3000/car", true);
        ajax.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
        ajax.send("plate=" + plate);
        ajax.addEventListener(
          "readystatechange",
          function () {
            if (app.isReady.call(this)) {
              let response = JSON.parse(this.responseText);
              if (response.message === "success") {
                $tbody.innerHTML = "";
                app.allCars();
              }
            }
          },
          false
        );
      },
    };
  })();

  app.init();
})(window.DOM);
