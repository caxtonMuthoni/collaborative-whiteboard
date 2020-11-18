<?php

namespace App\Http\Controllers;

use App\WhiteBoard;
use Illuminate\Http\Request;
use Auth;
use App\Events\DrawRequestEvent;
use App\Events\TerminateRequestEvent;
use App\Events\NewDrawEvent;
use App\Events\OpenRecentEvent;
use App\User;

class WhiteBoardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $canvas = WhiteBoard::orderBy('created_at', 'desc')->first();

        return response()->json([
            'canvas' => $canvas->canvas
        ]);
    }


    public function recentDrawings()
    {
        $recentDrawings = WhiteBoard::latest()->take(5)->get();
        return $recentDrawings;
    }

    public function store(Request $request)
    {
        $whiteBoard = WhiteBoard::orderBy('created_at', 'desc')->first();
        if($whiteBoard == null){
            $whiteBoard = new WhiteBoard;
            $whiteBoard->canvas = $request->canvas;
            $whiteBoard->name = $request->name;
        }else{
            if($whiteBoard->isComplete){
                $whiteBoard = new WhiteBoard;
                $whiteBoard->canvas = $request->canvas;
                $whiteBoard->name = $request->name;
            }
        }
        $whiteBoard->save();
    }

    
    public function drawRequest()
    {
        $user = Auth::user();
        event(new DrawRequestEvent($user));
    }

   
    public function terminate(Request $request, $id,$id2)
    {
        $user = User::find($id);
        $user->canEdit = false;
        $user->save();

        $activationUser = User::find($id2);
        $activationUser->canEdit = true;
        $activationUser->save();
         
        $users = [$user, $activationUser];

        event(new TerminateRequestEvent($users));

        return $user;
    }

    public function update(Request $request)
    {
        $whiteBoard = WhiteBoard::orderBy('created_at', 'desc')->first();
        $whiteBoard->canvas = $request->canvas;
        $whiteBoard->save();
    }

    public function newDraw(Request $request){
        $whiteBoard = WhiteBoard::orderBy('created_at', 'desc')->first();
        if($whiteBoard != null){
            $whiteBoard->isComplete = true;
            $whiteBoard->save();
        }
        event(new NewDrawEvent($request->name));
    }

    public function openRecent(Request $request, $id){
         $canvas = WhiteBoard::find($id);
         $whiteBoard = new WhiteBoard;
         $whiteBoard->canvas = $canvas->canvas;
         $whiteBoard->save();
         event(new OpenRecentEvent());
    }

    public function rename(Request $request, $id){
        $whiteBoard = WhiteBoard::find($id);
        $whiteBoard->name = $request->name;
        if($whiteBoard->save()){
            return response()->json([
                'status' => true,
                'message'=> 'The whiteboard was renamed successfully !!!'
            ]);
        }
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\WhiteBoard  $whiteBoard
     * @return \Illuminate\Http\Response
     */
    public function destroy(WhiteBoard $whiteBoard)
    {
        //
    }
}
