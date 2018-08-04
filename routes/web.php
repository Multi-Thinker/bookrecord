<?php

Route::get('/', 'Main@index');
Route::post("/addBooks","Main@add");
Route::post("/updateBooks","Main@update");
Route::post("/deleteBooks","Main@delete");
Route::get("/download/{type}/{selection}","Main@download");