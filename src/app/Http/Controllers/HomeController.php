<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\Events\DrawEvent;
use App\Events\UndoRedoEvent;
use App\Events\VoteEvent;
use App\User;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function getUsers(){
        $users = User::all();
        return $users;
    }
    public function index()
    {
        $name = Auth::user();
        return view('home',compact('name'));
    }

    public function vote()
    {
        $name = Auth::user();
        return view('vote',compact('name'));
    }


    public function draw(Request $request){
        $user = Auth::user();
        event(new DrawEvent($user,$request->canvas,$request->id));
    }

    public function undoRedo(Request $request){
        event(new UndoRedoEvent($request->action));
    }

    public function voteEvent(Request $request){
        event(new VoteEvent(Auth::user()->id, $request->candidateId));
    }

    public function createAdmin(Request $request,$id){

        $user = User::find($id);

        // Current Admin
        $currentAdmin = User::where('isAdmin',true)->first();

        if($currentAdmin != null){
            $currentAdmin->isAdmin = false;
            $currentAdmin->canEdit = false;
            $currentAdmin->save();
        }

        $user->isAdmin = true;
        $user->canEdit = true;
        $user->save();

    }
}
