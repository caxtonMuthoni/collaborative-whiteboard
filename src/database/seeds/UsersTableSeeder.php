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
            'name' => 'john',
            'email' => 'john@gmail.com',
            'canEdit'=> true,
            'password' => bcrypt('test1234'),
        ]);
        DB::table('users')->insert([
            'name' => 'bob',
            'email' => 'bob@gmail.com',
            'password' => bcrypt('test1234'),
        ]);
        DB::table('users')->insert([
            'name' => 'Alice',
            'canEdit'=> true,
            'email' => 'alice@gmail.com',
            'password' => bcrypt('test1234'),
        ]);

    }
}
