export default {

        getCanvas(){
            // var canvas = document.getElementById('mainCanvas');
            var canvas = new fabric.Canvas('mainCanvas', { selection: false });
            this.canvas = canvas;
            this.createCanvasGrid();
            this.updateCanvasStates(true);
        },

        // Drawing the grid
        createCanvasGrid () {
            var grid = 60;
            var unitScale = 10;
            var canvasWidth =  120 * unitScale;
            var canvasHeight = 120 * unitScale;

            this.canvas.setWidth(canvasWidth);
            this.canvas.setHeight(canvasHeight);

            var gridLines = [];

            for (var i = 0; i < (canvasWidth / grid); i++) {
            gridLines.push(new fabric.Line([ i * grid, 0, i * grid, canvasHeight], 
                { type:'line', stroke: '#424B54', selectable: false }));
            gridLines.push(new fabric.Line([ 0, i * grid, canvasWidth, i * grid], 
                { type: 'line', stroke: '#424B54', selectable: false }));
             }
            this.gridGroup = new fabric.Group(gridLines, {
                selectable: false,
                evented: false
              })
              this.gridGroup.addWithUpdate();
              this.canvas.add(this.gridGroup);
        },
      //  Removing the grid
        removeGrid() {
            this.gridGroup && this.canvas.remove(this.gridGroup);
            this.gridGroup = null;
          },

        //  Fabric free drawing

        handDraw(type){
            if(type === 'pen'){
               this.canvas.freeDrawingBrush.width = 1;
            }else{
                this.canvas.freeDrawingBrush.width = 10;
            }
            this.canvas.isDrawingMode = 1;
            this.canvas.freeDrawingBrush.color = "#f7f7f7";
            this.canvas.renderAll();
        },

        removeDrawMode(){
            this.canvas.isDrawingMode = 0;
        },

        setSelectMode(){
            this.removeDrawMode();
        },

         // Fabric js Box
         fabricTextBox(){
            this.removeDrawMode();
            var text = new fabric.IText('Edit text', {
                        width:250,
                        cursorColor :"blue",
                        top:30,
                        left:300,
                        fontSize:20,
                        fill:'#f7f7f7',
                        id: new Date().getUTCMilliseconds(),
                    });
                    this.deleteObject(text.id);
            this.canvas.add(text)
         },
         //  Fabric js Circle
         fabricCircle(){
           this.removeDrawMode();
           var circle = new fabric.Circle({radius: 100,
             fill: this.mainColor,
             stroke: 'grey',
             top:100,
             left: 100,
             strokeWidth: 3,
             originX: 'center', 
             originY: 'center' ,
             id: new Date().getUTCMilliseconds(),
           });
           this.deleteObject(circle.id);
           this.canvas.add(circle);
         },
        

        //  Fabric js Rectangle
        fabricRectangle(){
           this.removeDrawMode();
           var rectangle = new fabric.Rect({
               width:100,
               height:70,
               fill: this.mainColor,
               stroke: 'grey',
               left: 10,
               top:20,
               id: new Date().getUTCMilliseconds(),
           })
           this.deleteObject(rectangle.id);

           this.canvas.add(rectangle);
        },
        //  Fabric js Triangle
        fabricTriangle(){
            this.removeDrawMode();
            var triangle = new fabric.Triangle({
                width:100,
                height:70,
                fill: this.mainColor,
                stroke: 'grey',
                left: 10,
                top:20,
                id: new Date().getUTCMilliseconds(),
            });
            this.deleteObject(triangle.id);
            this.canvas.add(triangle);
        },

        // Fabric js Line

        fabricLine(){
            this.removeDrawMode();
            var line  = new fabric.Line([50, 100, 200, 200],{
               id: new Date().getUTCMilliseconds(),
               stroke: 'red',
               left: 170,
               top:150,
            });
            this.deleteObject(line.id);
            this.canvas.add(line);
        },

        // Clear canvas
        fabricClearWhiteboard(isFromEvent=false){
            this.clearListeners();
            this.canvas.clear();
            this.createCanvasGrid();
            if(!isFromEvent){
                console.log('cleared')
                this.canvasRedoOrUndo('clear');
            }
            this.canvasEventListeners();
        },

        // Event listeners
        canvasEventListeners(){
            var colorPicker = document.querySelector('.color-picker')
            var vm = this;
            this.canvas.on('object:added', function(e) { 
                if(e.target.type !== 'path'){
                    vm.broadCastEvent(e.target, e.target.id);
                    vm.updateCanvasStates(true);
                    vm.updateWhiteboard();
                }
                });
            this.canvas.on('object:removed', function(e) { 
                        vm.broadCastEvent(e.target, e.target.id);
                        vm.updateWhiteboard();

                    });
            this.canvas.on('object:modified', function(e) {
                vm.broadCastEvent(e.target, e.target.id);
                vm.updateCanvasStates(true);
                vm.updateWhiteboard();
            });
            this.canvas.on('selection:created', function (e) {
                colorPicker.style.display = 'block';
                vm.activeObject = vm.getSelection();
                vm.objectId =e.target.id;
            });
            this.canvas.on('selection:cleared', function () {
             colorPicker.style.display = 'none';
            });

            this.canvas.on("path:created", function(opt){
                opt.path.id = new Date().getUTCMilliseconds()
                vm.broadCastEvent(opt.path, opt.path.id);
                vm.updateCanvasStates(true);
                vm.updateWhiteboard();
              });
        },

        setColor(){
             document.getElementById('color').addEventListener('change',()=>{
                   console.log("Color changed");
                   console.log(this.activeObject);
                   this.activeObject.set("fill", this.objectColor)
                   this.broadCastEvent(this.activeObject,this.objectId)
                   this.canvas.renderAll()
                });
        },

        getSelection(){
            return this.canvas.getActiveObject() == null ? this.canvas.getActiveGroup() : this.canvas.getActiveObject()
        },

        broadCastEvent(canvasObject, id){
            axios.post('/draw',{canvas:JSON.stringify(canvasObject.toObject(['id'])),id:id}).then((data)=>{
                                
                });
        },

        loadJson(stringJson,id){
            // Parse JSON and add objects to canvas
            this.deleteObject(id);
            var vm = this;
            var jsonObj = JSON.parse(stringJson);
            fabric.util.enlivenObjects([jsonObj], function (enlivenedObjects) {
                // console.log(enlivenedObjects);
                vm.clearListeners();
                enlivenedObjects.forEach(function (obj, index) {
                     vm.canvas.setActiveObject(obj)
                     vm.canvas.add(obj);
                });
                vm.canvas.renderAll();
                vm.canvasEventListeners();
            });
        },

        deleteObject(id){
            var vm = this;
            this.canvas.getObjects().forEach(function(object) {
                if(object.id === id) {
                   console.log(`id is ${object.id}`)
                   vm.canvas.remove(object);
                }

                
            })
        },

       // Undo or redo canvas
        canvasRedoOrUndo(action, isEcho = false){
           if(action === 'undo'){
            if(!isEcho){
                this.sendUndoRedoRequest('undo');
            }
            if (this.canvasMods < this.canvasStates.length - 1) {
                console.log(`mod is ${this.canvasMods}`)
                this.canvas.clear().renderAll();
                this.clearListeners();
                this.canvas.loadFromJSON(this.canvasStates[this.canvasStates.length - 1 - this.canvasMods - 1]);
                this.canvasEventListeners();
                this.canvas.renderAll();
                this.canvasMods += 1;
            }
            }else if(action === 'redo'){
               console.log(`Canvas mod is ${this.canvasMods}`);
            if(!isEcho){
                this.sendUndoRedoRequest('redo');
             }
            if (this.canvasMods > 0) {
                this.canvas.clear().renderAll();
                this.clearListeners();
                this.canvas.loadFromJSON(this.canvasStates[this.canvasStates.length - 1 - this.canvasMods + 1]);
                this.canvasEventListeners();
                this.canvas.renderAll();
                this.canvasMods -= 1; 
            }
           }else if(action === 'clear'){
            if(!isEcho){
                this.sendUndoRedoRequest('clear');
             }
           }

        },

        updateCanvasStates(savehistory) {
            if (savehistory === true) {
                var myjson = JSON.stringify(this.canvas);
                this.canvasStates.push(myjson);
            }
        },

        sendUndoRedoRequest(action){
           axios.post('/undoredo',{action:action}).then((n)=>{
               console.log("sent")
           });
        },

        clearListeners(){
            this.canvas.off('object:added');
            this.canvas.off('object:removed');
            this.canvas.off('object:modified');
            this.canvas.off('path:created');
       },

        // Export canvas to png

        convertToImage() {
            this.canvas.forEachObject(object => {
                object.selectable = false;
                object.evented = false;
            });  
            let downloadLink = document.createElement('a');
            downloadLink.setAttribute('download', 'CanvasAsImage.png');
            let canvas = document.getElementById('mainCanvas');
            canvas.toBlob(function(blob) {
            let url = URL.createObjectURL(blob);
            downloadLink.setAttribute('href', url);
            downloadLink.click();
            });
          },


        //   Check if the leader is active

        monitoringLeaderPresence(users){
            var isAdmin = users.filter((user) => user.isAdmin).length > 0 ;
            if(!isAdmin){
                window.location.href ='/vote';
            }else{
                //this.newWhiteboard(this.user);
            }
        },


        // Update whiteboar state

        newWhiteboard(user,name){
            if(user.isAdmin){
                this.clearListeners();
                this.canvas.clear();
                this.createCanvasGrid();
                this.canvasEventListeners();

                axios.post('/whiteboard',{name:name,canvas:JSON.stringify(this.canvas.toObject(['id']))}).then(()=>{
                    console.log('Canvas created successfully')
                }).catch((error)=>{
                    console.log(error.message);
                })
            }
        },

        // update whiteboard

        updateWhiteboard(){
               axios.post('/update/whiteboard',{canvas:JSON.stringify(this.canvas.toObject(['id']))}).then(()=>{
                console.log('Canvas updated successfully')
            }).catch((error)=>{
                console.log(error.message);
            })
           
        },

        // get current state
        getCurrentState(){
                this.clearListeners();
                axios.get('/currentstate').then((data)=>{
                    this.canvas.clear().renderAll();
                    var jsonObj = JSON.parse(data.data.canvas);
                    console.log(jsonObj);
                    let vm = this;
                    fabric.util.enlivenObjects(jsonObj.objects, function (enlivenedObjects) {
                        vm.clearListeners();
                        vm.createCanvasGrid();
                        enlivenedObjects.forEach(function (obj, index) {
                            if(obj.get('type') !== 'group'){
                                vm.canvas.setActiveObject(obj)
                                vm.canvas.add(obj);
                            }
                            
                        });
                        vm.canvas.renderAll();
                        vm.canvasEventListeners();
                    });
                }).catch((error)=>{
                    console.log(error.message);
                })
                this.canvasEventListeners();
        },

        // Request to draw
        sendRequest(){
           this.$Progress.start();
           axios.post('/drawrequest').then(()=>{
               this.$swal('Sent','Request submitted successfully !!!','success');
               this.$Progress.finish();
           }).catch((error)=>{
               this.$Progress.fail();
               this.$swal('Sorry !',error.message,'error');
           })
        },

        endDrawSession(id,id2){
            this.$Progress.start();
            if(this.drawQueue.length < 1){
                this.$swal('Sorry','There is no user in the drawing queue !!!','info');
            }else{
                axios.post(`/terminate/${id}/${id2}`).then((data)=>{
                    let user = data.data;
                    this.currentUsers.forEach(cuser => {
                        if(cuser.id === user.id){
                            user.canEdit = false;
                        }
                    });
                this.approveDrawRequest();
                    this.$swal('Terminated','Session terminated successfully !!!','success');
                    this.$Progress.finish();
                }).catch((error)=>{
                    this.$Progress.fail();
                    this.$swal('Sorry !',error.message,'error');
                })
            }
            
        },

        // Add the request to the queue
        addRequestToTheQueue(user){
            this.drawQueue.push(user)
        },

        // approve draw request
        approveDrawRequest(){
            this.drawQueue.shift();
        },

        createNewCanvas(name){
            this.$Progress.start();
            axios.post('/newcanvas',{name:name}).then(()=>{
                this.$swal('Success','A new canvas was successfully !!!','success');
                this.$Progress.finish();
            }).catch((error)=>{
                this.$Progress.fail();
                this.$swal('Sorry !',error.message,'error');
            })
        },

        // open recent
        openRecent(id){
            this.$Progress.start();
            axios.post(`/openrecent/${id}`).then(()=>{
                this.$Progress.finish();
            }).catch((error)=>{
                this.$Progress.fail();
                this.$swal('Sorry !',error.message,'error');
            })
        }
    
}