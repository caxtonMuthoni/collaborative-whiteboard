<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/users','HomeController@getUsers');

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home')->middleware('auth');
Route::post('/draw','HomeController@draw');
Route::post('/undoredo','HomeController@undoRedo');
Route::get('/vote', 'HomeController@vote')->name('vote')->middleware('auth');
Route::post('/voteevent', 'HomeController@voteEvent');
Route::post('/createadmin/{id}', 'HomeController@createAdmin');

Route::post('/whiteboard', 'WhiteBoardController@store');
Route::post('/update/whiteboard', 'WhiteBoardController@update');
Route::get('/currentstate', 'WhiteBoardController@index');
Route::post('/drawrequest', 'WhiteBoardController@drawRequest');
Route::post('/terminate/{id}/{id2}', 'WhiteBoardController@terminate');

Route::get('/drawings', 'WhiteBoardController@recentDrawings');
Route::post('/newcanvas','WhiteBoardController@newDraw');
Route::post('/openrecent/{id}','WhiteBoardController@openRecent');
Route::post('/rename/{id}','WhiteBoardController@rename');

