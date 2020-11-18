<template>
    <div>
        <table class="table table-striped table-dark">
            <thead>
                <th>#</th>
                <th>Name</th>
                <th>Created at</th>
                <th>Action</th>
                <th>Rename</th>
            </thead>
            <tbody>
            <tr v-for="(draw, index) in drawings" :key="draw.id">
                <td>{{index + 1}}</td>
                 <td>{{draw.name}}</td>
                 <td>{{draw.created_at | upDate}}</td>
                 <td><a @click.prevent="openRecent(draw.id)" href="" class="btn btn-primary btn-sm">open</a></td>
                 <td><a href="" @click.prevent="showModal(draw)" class="btn btn-info btn-sm">Rename</a></td>
            </tr>
            </tbody>
            <tfoot>
                <th>#</th>
                <th>Name</th>
                <th>Created at</th>
                <th>Action</th>
                <th>Rename</th>
            </tfoot>
        </table>
       
        
        <!-- Modal -->
        <div class="modal fade" id="update-form" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Rename  Whiteboard</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                    </div>
                    <form @submit.prevent="rename(updateDraw.id,name)">
                        <div class="modal-body">
                            <div class="form-group">
                              <label for="">Enter your Whiteboard name</label>
                              <input type="text"
                                class="form-control" v-model="name" name="name" id="name" aria-describedby="helpId" placeholder="">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-success">Rename</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            drawings: [],
            name: '',
            updateDraw:''
        }
    },

    methods: {
        showModal(draw){
            this.updateDraw =draw;
            this.name =draw.name;
          
          $('#update-form').modal('show');
        },
        rename(id,name){
         this.$Progress.start();
         axios.post(`/rename/${id}`,{name:name}).then((data)=>{
             this.recentDrawings();
             this.$swal('Success',data.data.message,'success');
             this.$Progress.finish();
             $('#update-form').modal('hide');
         }).catch((error)=>{
             this.$swal('Sorry !',error.message,'error');
             this.$Progress.fail();
         })
        },
        openRecent(id){
         console.log(id);
         this.$emit('openrecent',id);
        },
        recentDrawings(){
            axios.get('/drawings').then((data)=>{
                this.drawings = data.data;
                console.log(data.data);
            })
        }
    },
    mounted() {
        this.recentDrawings();
    },
}
</script>