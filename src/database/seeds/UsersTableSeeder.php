<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'John',
            'email' => 'john@gmail.com',
            'canEdit'=> true,
            'password' => bcrypt('pass1234'),
        ]);
        DB::table('users')->insert([
            'name' => 'Doe',
            'email' => 'doe@gmail.com',
            'password' => bcrypt('pass1234'),
        ]);

    }
}
