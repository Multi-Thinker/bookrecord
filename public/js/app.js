/**
 * Author: Talha Habib
 * Description: Pure JS skill demonstration
 */
var index = []; // cell index
(function() {
  var titleIN = document.querySelector("#title");
  var authorIN = document.querySelector("#author");
  var idIN = document.querySelector("#id");
  var subBtn = document.querySelector("#add");
  var canBtn = document.querySelector("#cancel");
  var titleHint = document.querySelector(".titleHint");
  var authorHint = document.querySelector(".authorHint");
  var deleteBtn = document.querySelectorAll(".deleteBtn");
  var notFound = document.querySelector(".notFound");
  var table = document.querySelector(".resultTable");
  var editorBtn = document.querySelectorAll(".editor");
  var pop = document.querySelector(".pop");
  var popup = document.querySelector(".popup");
  var tbody = table.querySelector("tbody");
  var tds = tbody.querySelectorAll("td");
  var lastTr = tbody.querySelectorAll("tr");
  var lastID = 1;
  if (lastTr.length > 0) {
    lastID = lastTr[lastTr.length - 1].getAttribute("data-row");
  }
  var searchInput = document.querySelector(".searchTable");
  /** search table **/
  searchInput.addEventListener("keyup", function() {
    var tds = tbody.querySelectorAll("td");
    var inputVal = this.value.toLowerCase();
    addClasses(table, "td", "hidden");
    if (inputVal.length > 0) {
        Array.from(tds).forEach(function(elem, key) {
        if (elem.textContent.toLowerCase().includes(inputVal))
          elem.parentNode.classList.remove("hidden");
      });
    } else {
      removeClasses(table, "td", "hidden");
    }
  });
  /** sorting**/
  var toggleBool; // sorting asc, desc
  function sorting(tbody, index, elem) {
    if(tbody.rows.length<=1){
      return false;
    }
    var icon = elem.querySelector("i").classList;
    var icons = table.querySelectorAll("th i");
    Array.from(icons).forEach(function(el) {
      el.classList.add("hidden");
    });
    elem.querySelector("i").classList.remove("hidden");

    if (this.index[index]) {
      toggleBool = false;
      icon.remove("fa-arrow-down");
      icon.add("fa-arrow-up");
    } else {
      toggleBool = true;
      icon.remove("fa-arrow-up");
      icon.add("fa-arrow-down");
    }

    this.index[index] = toggleBool;
    var datas = new Array();
    var tbodyLength = tbody.rows.length;
    for (var i = 0; i < tbodyLength; i++) {
      datas[i] = tbody.rows[i];
    }
    var oldDatas = toCell(datas, index);

    // sort by cell[index]
    datas.sort(function(a, b) {
      return compareCells(a, b, index);
    });
    var newDatas = toCell(datas, index);
    if (diff(newDatas, oldDatas) == false) {
      sorting(tbody, index, elem);
      return false;
    }

    for (var i = 0; i < tbody.rows.length; i++) {
      // rearrange table rows by sorted rows
      tbody.appendChild(datas[i]);
    }
  }

  var title_head = document.querySelector(".title_head");
  var author_head = document.querySelector(".author_head");
  /** sorting title**/
  title_head.addEventListener("click", function() {
    sorting(tbody, 0, this);
  });
  /** sorting author **/
  author_head.addEventListener("click", function() {
    sorting(tbody, 1, this);
  });

  
  /** validation **/
  
  titleIN.addEventListener("blur", function() {
      titleHintF();
  });
  authorIN.addEventListener("blur", function() {
      authorHintF();
  });
  //** submit **/
  subBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    e.preventDefault();
    var title = htmlEntities(titleIN.value);
    var author = htmlEntities(authorIN.value);
    titleHintF();
    authorHintF();
    if (title == "" || author == "") {
      return false;
    }
    var btn = '<button class="deleteBtn"><i class="fa fa-trash"></i></button>';
    if (idIN.value == "") {
      // insert
      lastID++;
      var Xstatus = ajax("/addBooks","title="+encodeURIComponent(title)+"&author="+encodeURIComponent(author));
      lockform();
      logging("adding new book...");
      lockEdit();
      Xstatus.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          appendHTML(
            tbody,
            "<tr data-row='" +
              this.responseText +
              "'><td class='title_content'><button class='editor'><i class='fa fa-pencil'></i></button><span class='text'>" +
              title +
              "</span></td><td class='author_content'><span class='text'>" +
              author +
              "</span></td><td>" +
              btn +
              "</td></tr>"
          );
          lastID = this.responseText;
          logging("new book added");
          registerEdit();
          registerDel();
        }else{
          logging("error in adding new book");
        }
        unlockForm();
      };
    } else {
      lockform();
      var tlastID = htmlEntities(idIN.value);
      var trow = tbody.querySelector("tr[data-row='" + tlastID + "']");
      var ttcon = trow.querySelector(".title_content");
      var tauh = trow.querySelector(".author_content");
      var Xstatus = ajax("/updateBooks","title="+encodeURIComponent(title)+"&author="+encodeURIComponent(author)+"&id="+tlastID);
      logging("updating book...");
      Xstatus.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          ttcon.querySelector(".text").innerHTML = title;
          tauh.querySelector(".text").innerHTML = author;
          logging("book updated");
        }else{
          logging("error in updating books");
        }
        unlockForm();
      };
    }
  });
  /** cancel btn **/
  canBtn.addEventListener("click", function() {
    unlockEdit();
    clear();
  });
  /** download btn **/
  pop.addEventListener("click", function() {
    popup.classList.toggle("hidden");
  });
  /** functions **/
  /** editing **/
  function registerEdit() {
    var editorBtn = document.querySelectorAll(".editor");
    Array.from(editorBtn).forEach(function(elem) {
      elem.addEventListener("click", function() {
        clearWarn();
        lockEdit();        
        canBtn.classList.remove("hidden");
        var row = this.parentNode.parentNode;
        var title = row.querySelector(".title_content").textContent;
        var author = row.querySelector(".author_content").textContent;
        var id = row.getAttribute("data-row");
        idIN.value = id;
        titleIN.value = title.trim();
        authorIN.value = author.trim();
        subBtn.value = "Update";
      });
    });
  }
  registerEdit();
  /** deleting **/
  function registerDel() {
    var deleteBtn = document.querySelectorAll(".deleteBtn");
    Array.from(deleteBtn).forEach(function(el) {
      el.addEventListener("click", function() {
        lockDelete();
        var id = this.parentNode.parentNode.getAttribute("data-row");
        logging("deleting book...");
        var xSend = ajax("/deleteBooks","id="+id);
        var thisBtnRow = this.parentNode.parentNode;
        xSend.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            thisBtnRow.remove();
            checkEmptyTable();
            logging("book deleted");
          }else{
            logging("error in deleting book");
          }
          unlockDelete();
        };
      });
    });
  }
  registerDel();
  function logging(string){
    var log = document.querySelector(".log");
    log.innerHTML = string;
    log.classList.remove("hidden");
    setTimeout(function(){
      log.classList.add("hidden");
    },1000);
  }
  function ajax(url,query){
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("X-CSRF-TOKEN", token);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(query+"&_token="+token);
        return xhttp;
  }
  function lockform(){
    lockEdit();
    lockInsert();
  }
  function unlockForm(){
    clear();
    unlockEdit();
    unlockInsert();
  }
  function lockEdit(){
    var editorBtn = document.querySelectorAll(".editor");
    Array.from(editorBtn).forEach(function(elem){
      elem.setAttribute("disabled","disabled");
    });
  }
  function lockDelete(){
    var deleteBtn = document.querySelectorAll(".deleteBtn");
    Array.from(deleteBtn).forEach(function(elem){
      elem.setAttribute("disabled","disabled");
    });
  }
  function lockInsert(){
    subBtn.setAttribute("disabled","disabled");
    canBtn.setAttribute("disabled","disabled");
    titleIN.setAttribute("disabled","disabled");
    authorIN.setAttribute("disabled","disabled");
    idIN.setAttribute("disabled","disabled");
  }
  function unlockEdit(){
    var editorBtn = document.querySelectorAll(".editor");
    Array.from(editorBtn).forEach(function(elem){
      elem.removeAttribute("disabled");
    });
  }
  function unlockDelete(){
    var deleteBtn = document.querySelectorAll(".deleteBtn");
    Array.from(deleteBtn).forEach(function(elem){
      elem.removeAttribute("disabled");
    });
  }
  function unlockInsert(){
    subBtn.removeAttribute("disabled");
    canBtn.removeAttribute("disabled");
    titleIN.removeAttribute("disabled");
    authorIN.removeAttribute("disabled");
    idIN.removeAttribute("disabled");
  }
  function titleHintF() {
    var title = titleIN.value;
    if (title == "") {
      titleHint.classList.remove("hidden");
      subBtn.setAttribute("disabled", "disabled");
      subBtn.classList.add("disabled");
      return false;
    } else {
      titleHint.classList.add("hidden");
      subBtn.removeAttribute("disabled");
      subBtn.classList.remove("disabled");
    }
  }
  function authorHintF() {
    var author = authorIN.value;
    if (author == "") {
      authorHint.classList.remove("hidden");
      subBtn.setAttribute("disabled", "disabled");
      subBtn.classList.add("disabled");
      return false;
    } else {
      authorHint.classList.add("hidden");
      subBtn.removeAttribute("disabled");
      subBtn.classList.remove("disabled");
    }
  }
  function htmlEntities(e) {
    return String(e)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function clearWarn(){
      titleHint.classList.add("hidden");
      authorHint.classList.add("hidden");
  }
  function clear() {
    titleIN.value = "";
    authorIN.value = "";
    idIN.value = "";
    subBtn.value = "Add";
    canBtn.classList.add("hidden");
    clearWarn();
  }
  function addClasses(parent, elem, cls) {
    Array.from(parent.querySelectorAll(elem)).forEach(function(elem, key) {
      elem.parentNode.classList.add(cls);
    });
  }
  function removeClasses(parent, elem, cls) {
    Array.from(parent.querySelectorAll(elem)).forEach(function(elem, key) {
      elem.parentNode.classList.remove(cls);
    });
  }
  function toCell(datas, index) {
    var arr = [];
    Array.from(datas).forEach(function(val) {
      arr.push(val.cells[index].innerText);
    });
    return arr;
  }
  function diff(newDatas, oldDatas) {
    var difference = false;
    for (var j = 0; j < oldDatas.length; j++) {
      if (newDatas[j] != oldDatas[j]) {
        difference = true;
        break;
      }
    }
    return difference;
  }
  function compareCells(a, b, index) {
    var aVal = a.cells[index].innerText;
    var bVal = b.cells[index].innerText;

    aVal = aVal.replace(/\,/g, "");
    bVal = bVal.replace(/\,/g, "");

    if (toggleBool) {
      var temp = aVal;
      aVal = bVal;
      bVal = temp;
    }

    if (aVal.match(/^[0-9]+$/) && bVal.match(/^[0-9]+$/)) {
      return parseInt(aVal) - parseInt(bVal);
    } else {
      if (aVal < bVal) {
        return -1;
      } else if (aVal > bVal) {
        return 1;
      } else {
        return 0;
      }
    }
  }
  function checkEmptyTable() {
    var tr = tbody.querySelectorAll("tr").length;
    if (tr <= 0) {
      table.parentNode.classList.add("hidden");
      notFound.classList.remove("hidden");
    } else {
      table.parentNode.classList.remove("hidden");
      notFound.classList.add("hidden");
    }
  }
  checkEmptyTable();
  // easy append function
  function appendHTML(element, html) {
    var t = parseHTML(html);
    var trs = element.querySelectorAll("tr").length;
    if (trs > 0) {
      element.insertBefore(t, element.lastElementChild.nextSibling);
    } else {
      element.insertBefore(t, element.lastChild);
      checkEmptyTable();
    }
  }
  function parseHTML(html) {
    var t = document.createElement("template");
    t.innerHTML = html;
    return t.content.cloneNode(true);
  }
})();