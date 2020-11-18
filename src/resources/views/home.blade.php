@extends('layouts.app')

@section('content')
<div class="container-fluid">
    <main-app :user="{{Auth::user() != null ? Auth::user() : 'no'}}" />
</div>
@endsection
