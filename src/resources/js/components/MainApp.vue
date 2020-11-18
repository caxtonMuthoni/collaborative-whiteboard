<template>
    <div class="container-fluid m-0 p-0">
        <div class="row justify-content-center no-gutters m-0 p-0">
          <div class="col-md-12">
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul class="navbar-nav mr-auto">
                    <li class="nav-item dropdown  mx-2">
                      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        File
                      </a>
                      <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a v-if="user.isAdmin" data-toggle="modal" data-target="#new-canvas-form" href="" class="list-group-item list-group-item-action tool dropdown-item"><span><i class="fas fa-folder-plus mr-2   "></i></span>Create New</a>
                           <a @click.prevent="convertToImage" href="" class="list-group-item list-group-item-action tool dropdown-item"><span><i class="fas fa-save  mr-2  "></i></span>Save</a>
                           <a v-if="user.isAdmin" href="" data-toggle="modal" data-target="#open-recent" class="list-group-item list-group-item-action tool dropdown-item"><span><i class="fas fa-clock mr-2   "></i></span>Open Recent</a>
                           <a v-if="user.isAdmin" href="" data-toggle="modal" data-target="#queueModal" class="list-group-item list-group-item-action tool dropdown-item"><span><i class="fas fa-draw-polygon  mr-2  "></i></span>Draw Requests</a>
                            
                      </div>
                    </li>

                    <li class="nav-item dropdown  mx-2">
                      <a :class="{disabled: !user.canEdit}" class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Edit
                      </a>
                      <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a href="" :class="{disabled: !user.canEdit}" @click.prevent="canvasRedoOrUndo('undo')" class="list-group-item list-group-item-action tool"><span><i class="fas fa-undo  mr-2  "></i></span>Undo</a>
                       <a href="" :class="{disabled: !user.canEdit}" @click.prevent="canvasRedoOrUndo('redo')" class="list-group-item list-group-item-action tool"><span><i class="fas fa-redo mr-2   "></i></span>Redo</a>
                        <a href="" :class="{disabled: !user.canEdit}" @click.prevent="fabricClearWhiteboard()" class="list-group-item list-group-item-action tool"><span><i class="fas fa-trash  mr-2 text-danger "></i></span>Clear</a>
                      </div>
                    </li>

                    <li class="nav-item dropdown  mx-2">
                      <a :class="{disabled: !user.canEdit}" class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Shapes
                      </a>
                      <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                             <li><a href="" @click.prevent="fabricCircle" class="dropdown-item"><i class="fas fa-circle m-2   "></i> Circle</a></li>
                                <div class="dropdown-divider"></div>
                                <li><a href="" @click.prevent="fabricRectangle" class="dropdown-item"> <i class="fas m-2 fa-vector-square    "></i> Rectangle</a></li>
                                <div class="dropdown-divider"></div>
                                <li><a href="" @click.prevent="fabricTriangle" class="dropdown-item"> <i class="fas m-2 fa-caret-up    "></i> Triangle</a></li>
                            
                      </div>
                    </li>

                    <li class="nav-item dropdown  mx-2">
                      <a :class="{disabled: !user.canEdit}" class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Free Draw
                      </a>
                      <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                         <a href="" @click.prevent="handDraw('brush')" class="list-group-item list-group-item-action tool dropdown-item"><span><i class="fas fa-paint-brush  mr-2  "></i></span> Brush</a>
                            <a href="" @click.prevent="handDraw('pen')" class="list-group-item list-group-item-action tool dropdown-item"><span> <i class="fas fa-pen   mr-2 "></i> </span> Pen</a>
                      </div>
                    </li>
                    <li class="nav-item  mx-2">
                      <a class="nav-link" href="#" @click.prevent="fabricTextBox" :class="{disabled: !user.canEdit}" ><span><i class="mr-2 fas fa-text-width    "></i></span>Text</a>
                    </li>
                    <li class="nav-item  mx-2">
                      <a class="nav-link" href="#"  :class="{disabled: !user.canEdit}" @click.prevent="fabricLine" ><span> <i class="fas fa-minus mr-2   "></i></span> Line</a>
                    </li>
        
                    <li class="nav-item mx-2">
                      <a class="nav-link" href="#" v-if="!user.canEdit" @click.prevent="sendRequest" ><span> <i class="fas fa-paper-plane mr-2   "></i></span>Request To Draw</a>
                       <a href="#" title="You are drawing" v-else class="badge badge-primary nav-link">Drawing</a>
                    </li>
                    <li class="nav-item mx-2 float-right">
                      
                    </li>
                  </ul>
                   <form class="form-inline my-2 my-lg-0 color-picker" style="display:none;">
                     <a href="" class=" disabled badge badge-info my-2 my-sm-0">Set Fill color</a>
                      <input style="width:50px;" class="form-control mr-sm-2" type="color" v-model="objectColor" name="color" id="color">
                    </form>
                </div>
              </nav>
          </div>
             <div class="col-md-2">
               <div style="height:85vh;" class="bg-dark">
                    <ul class="list-group active-users bg-dark">
                        <li class="list-group-item list-group-item-dark"><i class="fas text-success fa-users mr-1"></i><strong class="text-info">{{usersCount}} Active Users</strong></li>
                        <li v-for="user in currentUsers" :key="user.id"  class="list-group-item list-group-item-dark"> <span><a v-if="user.isAdmin == 1" href="" title="Admin" class="btn"><i class="fas fa-lock text-success  mr-2 "></i></a>
                        <a v-else title="Member" href="" class="btn"><i class="fas fa-check  mr-2 text-info "></i></a></span>{{user.name}}
                          <a :title="user.name + ' can edit'" v-show="user.canEdit" class="btn float-right p-0" href=""><span class="badge badge-info">Editing</span></a>
                        </li>
                       
                        
                </ul>
               </div>
            </div>
            <div class="col-md-10 bg-dark">
                <div class="card" style="height:86vh;">
                    <div class="card-body p-0 canvas-container">
                        <canvas width="100" height="100" class="gridCanvas" id="mainCanvas"></canvas>
                    </div>
                </div>
            </div>
            
        </div>

      
      <!-- Modal -->
      <div class="modal fade" id="queueModal" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content bg-dark text-light">
              <div class="modal-header">
                  <h5 class="modal-title">Drawing Users Management</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            <div class="modal-body">
              <div class="container-fluid">
                <div class="card-header">
                 <strong class="text-info">Drawing members</strong>
              </div>
               <table class="table table-striped table-dark">
                 <thead>
                        <th>#</th>
                        <th>Member</th>
                        <th>Action</th>
                    </thead>
                    <tbody>
                        <tr v-for="(user,index) in getActiveUsers" :key="user.id">
                            <td>{{index + 1}}</td>
                            <td>{{user.name}}</td>
                            <td v-if="!user.isAdmin"><a href="" @click.prevent="endDrawSession(user.id,drawQueue.length > 0 ? drawQueue[0].id : 0)" class="btn btn-primary btn-sm"><span><i class="fas fa-check mr-2   "></i></span>Terminate</a></td>
                            <td v-else><a href="" @click.prevent="" class="btn btn-success btn-sm"><span><i class="fas fa-lock mr-2   "></i></span>Admin</a></td>
                        
                        </tr>
                    </tbody>
                    <tfoot>
                        <th>#</th>
                        <th>Member</th>
                        <th>Action</th>
                    </tfoot>
               </table>
              </div>
              <div class="card-header">
                 <strong class="text-info">Waiting members</strong>
              </div>
              <table class="table table-striped table-dark">
                 <thead>
                        <th>#</th>
                        <th>Member</th>
                        <th>Action</th>
                    </thead>
                    <tbody>
                        <tr v-for="(user,index) in drawQueue" :key="user.id">
                            <td>{{index + 1}}</td>
                            <td>{{user.name}}</td>
                            <td><a href="" class="badge badge-success">waiting in the queue</a></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <th>#</th>
                        <th>Member</th>
                        <th>Action</th>
                    </tfoot>
               </table>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modal -->
      <div class="modal fade" id="open-recent" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content bg-dark text-light">
            <div class="modal-header">
              <h5 class="modal-title">Recent drawing</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
              <RecentDrawing @openrecent="openRecent"/>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      
      <!-- Modal -->
      <div class="modal fade" id="new-canvas-form" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
        <div class="modal-dialog bg-dark" role="document">
          <div class="modal-content bg-dark text-light">
            <div class="modal-header">
              <h5 class="modal-title">Create new Drawing</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form @submit.prevent="createNewCanvas(name)">
               <div class="modal-body">
                 <div class="form-group">
                   <label for="name">What is the name of the whiteboard</label>
                   <input type="text" v-model="name" class="form-control" name="name" id="name" placeholder="eg.circuit design">
                 </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                  <button type="submit" class="btn btn-primary">Create</button>
                </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  
</template>

<script>
import 'fabric-history';
import { fabric } from 'fabric'
import methods from './methods'
import RecentDrawing from './RecentDrawing'
    export default {
        data() {
            return {
                msg:'turtututu',
                canvas: '',
                usersCount: null,
                currentUsers: [],
                objectColor: '#ccc',
                activeObject:null,
                objectId:0,
                canvasStates: [],
                canvasMods: 0,
                sendBroadcast: true,
                gridGroup:null,
                drawQueue: [],
                name: '',
                mainColor: '#424B54',
            }
        },
        props:['user'],
        components:{
          RecentDrawing
        },
        computed: {
          getActiveUsers(){
            return this.currentUsers.filter((user)=>user.canEdit);
          }
        },
        methods:{...methods},
        mounted() {
            Echo.private('draw')
             .listen('DrawEvent',(e)=>{
                this.clearListeners();
                this.loadJson(e.canvas,e.id);
                this.canvasEventListeners();
                this.updateCanvasStates(true);
                // this.updateWhiteboard(this.user);
                
                console.log(`lenght state is : ${this.canvasStates.length}`);
            });

            Echo.join('draw')
                .here((users)=>{
                    this.usersCount = users.length;
                    this.currentUsers = users;
                    setTimeout(()=>{
                      this.monitoringLeaderPresence(this.currentUsers);
                    },30000)
                    console.log(this.currentUsers)
                })
                .joining((user)=>{
                    this.usersCount += 1;
                    this.$toaster.success(`${user.name} has joined the group`);
                    this.currentUsers.push(user);
                })
                .leaving((user)=>{
                    this.usersCount -= 1;
                    this.$toaster.info(`${user.name} has left the group`);
                    this.currentUsers = this.currentUsers.filter((userObj)=>user !== userObj);
                    this.monitoringLeaderPresence(this.currentUsers);
                });

            Echo.private('undoredo').listen('UndoRedoEvent',(e)=>{
                if(e.action === 'redo'){
                    this.canvasRedoOrUndo('redo', true)
                }else if(e.action === 'undo'){
                    this.canvasRedoOrUndo('undo', true);
                }else if(e.action == 'clear'){
                    this.fabricClearWhiteboard(true);
                }
            
            });

            Echo.private('drawrequest').listen('DrawRequestEvent',(e)=>{
              if(this.user.isAdmin){
                this.addRequestToTheQueue(e.user);
              }
            });

            Echo.private('terminate').listen('TerminateRequestEvent',(e) => {
              e.users.forEach(user => {
                if(this.user.id === user.id){
                 //window.location.reload(true); 
                 window.stop();
                 window.location.href = window.location.href;
              }
              });
              
            });

            Echo.private('newdraw').listen('NewDrawEvent',(e)=>{
                this.newWhiteboard(this.user,e.name);
                window.location.href = window.location.href;
                if(!this.user.isAdmin){
                   this.$toaster.info(` Admin has created a new drawing canvas.`);
                }
              });

            Echo.private('openrecent').listen('OpenRecentEvent',(e)=>{
              window.location.href = window.location.href;
                if(!this.user.isAdmin){
                   this.$toaster.info(` Admin has opened a recent drawing canvas.`);
                }
            })


            this.getCanvas();
            this.canvasEventListeners();
            this.setColor();
            this. getCurrentState();
        }
    }
</script>

<style scoped>
   .canvas-container{
    overflow:hidden;
    background:#292b2c;
    width: 100%;
    height: 100%;
   }

   .dot{
       font-size: 0.7em;
   }

   .active-users{
       height: 85vh;
       overflow-y: auto;
   }

   .tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity .15s, visibility .15s;
}

.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}
 
  
</style>