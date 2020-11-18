@extends('layouts.app')

@section('content')
<div class="container-fluid">
    <vote :user="{{Auth::user() != null ? Auth::user() : 'no'}}" />
</div>
@endsection
