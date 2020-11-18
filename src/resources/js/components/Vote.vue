<template>
    <div class="container">
        <div class="card bg-dark text-light">
            <div class="card-header">Voting for the Leader</div>
            <div class="card-body">
                <table class="table table-striped table-dark">
                    <thead>
                        <th>#</th>
                        <th>Candidate Name</th>
                        <th>Votes count</th>
                        <th>Action</th>
                    </thead>
                    <tbody>
                        <tr v-for="(user,index) in currentUsers" :key="user.id">
                            <td>{{index + 1}}</td>
                            <td>{{user.name}}</td>
                            <td>{{getVotes(user.id)}}</td>
                            <td><a href="" @click.prevent="vote(user.id)" class="btn btn-success btn-sm"><span><i class="fas fa-check mr-2   "></i></span> Vote</a></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <th>#</th>
                        <th>Candidate Name</th>
                        <th>Votes count</th>
                        <th>Action</th>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            usersCount: null,
            currentUsers: [],
            votes:[]
            
        }
    },
    props:['user'],
    computed: {
        
    },
    methods: {
        getVotes(userId){
            return this.votes.filter((vote)=>vote.candidateId === userId).length;
        },

        vote(candidateId){
            let hasVoted = this.votes.filter((vote)=> vote.userId === this.user.id).length > 0;
            if(hasVoted){
                this.$toaster.error(`Sorry you can't vote twice`);
                
            }else{
            this.$Progress.start();
            axios.post('/voteevent',{candidateId:candidateId}).then(()=>{
                            this.votes.push({
                                userId: this.user.id,
                                candidateId: candidateId
                            });
                            this.generateLeader();
                            this.$swal('Voted Successfully','Please wait for others to complete voting.','success');
                            this.$Progress.finish();
                        }).catch((error)=>{
                            this.$Progress.fail();
                            this.$swal('Sorry !',error.message,'error');
                        })
            }
            
        },

        // Generating the new leader
        generateLeader(){
            this.currentUsers.forEach((user)=>{
                let userVotes = this.votes.filter((vote)=>vote.candidateId === user.id).length;
                let averangeVotes = this.currentUsers.length/2;
                if(userVotes >= averangeVotes){
                    axios.post(`/createadmin/${user.id}`).then(()=>{
                        window.location.href = '/home'
                    })
                }
                
            })
        }
    },
    mounted() {
        Echo.join('draw')
                .here((users)=>{
                    this.usersCount = users.length;
                    this.currentUsers = users;
                    this.currentUsers.forEach((user)=>{
                        user.votes = 0;
                    });

                    this.currentUsers.forEach(user=>{
                        if(user.isAdmin){
                            window.location.href='/home';
                        }
                    })

                    
                })
                .joining((user)=>{
                    this.usersCount += 1;
                    this.$toaster.success(`${user.name} has joined the group`);
                    user.votes = 0;
                    this.currentUsers.push(user);
                     if(user.isAdmin){
                      window.location.href ='/home';
                    }
                })
                .leaving((user)=>{
                    this.usersCount -= 1;
                    this.$toaster.info(`${user.name} has left the group`);
                    this.currentUsers = this.currentUsers.filter((userObj)=>user !== userObj);
                });

        Echo.private('vote').listen('VoteEvent',(e)=>{
            console.log(e.candidateId + 'has voted !!!!!');
             this.votes.push({
                    userId: e.userId,
                    candidateId: e.candidateId
                });

                this.generateLeader();
            
        })

    },
}
</script>