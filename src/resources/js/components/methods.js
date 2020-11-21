export default {

        getCanvas(){
            var whitebaordCanvas = new fabric.Canvas('mainCanvas', { selection: false });
            this.whitebaordCanvas = whitebaordCanvas;
            this.createCanvasGrid();
            this.changeWhiteboardStates(true);
        },

        // Drawing the grid
        createCanvasGrid () {
            var gridLength = 60;
            var unitLength = 10;
            var c_width =  120 * unitLength;
            var c_height = 120 * unitLength;

            this.whitebaordCanvas.setWidth(c_width);
            this.whitebaordCanvas.setHeight(c_height);
            var gridLines = [];

            for (var i = 0; i < (c_width / gridLength); i++) {
                // drawing grid lines and adding them to the  fabric group
            gridLines.push(new fabric.Line([ i * gridLength, 0, i * gridLength, c_height], 
                { type:'line', stroke: '#424B54', selectable: false }));
            gridLines.push(new fabric.Line([ 0, i * gridLength, c_width, i * gridLength], 
                { type: 'line', stroke: '#424B54', selectable: false }));
             }
            this.gridGroup = new fabric.Group(gridLines, {
                selectable: false,
                evented: false
              })
              this.gridGroup.addWithUpdate();
              this.whitebaordCanvas.add(this.gridGroup);
        },
        
      //  clearing  the grid
        clearGridFromCanvas() {
            this.gridGroup && this.whitebaordCanvas.remove(this.gridGroup);
            this.gridGroup = null;
          },

        //  Fabric free drawing

        handDraw(selectedTool){
            if(selectedTool === 'pen'){
               this.whitebaordCanvas.freeDrawingBrush.width = 1;
            }else{
                this.whitebaordCanvas.freeDrawingBrush.width = 10;
            }
            this.whitebaordCanvas.isDrawingMode = 1;
            this.whitebaordCanvas.freeDrawingBrush.color = "#f7f7f7";
            this.whitebaordCanvas.renderAll();
        },

        clearDrawMode(){
            this.whitebaordCanvas.isDrawingMode = 0;
        },

        setSelectMode(){
            this.clearDrawMode();
        },

         // Fabric js TextBox
         fabricTextBox(){
            this.clearDrawMode();
            var textField = new fabric.IText('Edit text', {
                        width:250,
                        cursorColor :"blue",
                        top:30,
                        left:300,
                        fontSize:20,
                        fill:'#f7f7f7',
                        id: new Date().getUTCMilliseconds(),
                    });
                    this.deleteCanvasItem(textField.id);
            this.whitebaordCanvas.add(textField)
         },
         //  Fabric js Circle
         fabricCircle(){
           this.clearDrawMode();
           var circle = new fabric.Circle({radius: 100,
             fill: this.mainColor,
             stroke: '#cccccc',
             top:100,
             left: 100,
             strokeWidth: 3,
             originX: 'center', 
             originY: 'center' ,
             id: new Date().getUTCMilliseconds(),
           });
           this.deleteCanvasItem(circle.id);
           this.whitebaordCanvas.add(circle);
         },
        

        //  Fabric js Rectangle
        fabricRectangle(){
           this.clearDrawMode();
           var rectangle = new fabric.Rect({
               width:100,
               height:70,
               fill: this.mainColor,
               stroke: '#cccccc',
               left: 10,
               top:20,
               id: new Date().getUTCMilliseconds(),
           })
           this.deleteCanvasItem(rectangle.id);

           this.whitebaordCanvas.add(rectangle);
        },
        //  Fabric js Triangle
        fabricTriangle(){
            this.clearDrawMode();
            var triangle = new fabric.Triangle({
                width:100,
                height:70,
                fill: this.mainColor,
                stroke: '#cccccc',
                left: 10,
                top:20,
                id: new Date().getUTCMilliseconds(),
            });
            this.deleteCanvasItem(triangle.id);
            this.whitebaordCanvas.add(triangle);
        },

        // Fabric js Line

        fabricLine(){
            this.clearDrawMode();
            var line  = new fabric.Line([100, 200, 200, 200],{
               id: new Date().getUTCMilliseconds(),
               stroke: 'white',
               strokeWidth: 3,
               left: 170,
               top:150,
            });
            this.deleteCanvasItem(line.id);
            this.whitebaordCanvas.add(line);
        },

        // Clear whitebaordCanvas
        fabricClearWhiteboard(event=false){
            this.deactivateWhiteboardListeners();
            this.whitebaordCanvas.clear();
            this.createCanvasGrid();
            if(!event){
                this.canvasRedoOrUndo('clear');
            }
            this.whiteboardListeners();
        },

        // Event listeners
        whiteboardListeners(){
            var colorPicker = document.querySelector('.color-picker')
            var context = this;
            this.whitebaordCanvas.on('object:added', function(event) { 
                if(event.target.type !== 'path'){
                    context.shareCanvasObject(event.target, event.target.id);
                    context.changeWhiteboardStates(true);
                    context.updateWhiteboardState();
                }
                });
            this.whitebaordCanvas.on('object:removed', function(event) { 
                        context.shareCanvasObject(event.target,event.target.id);
                        context.updateWhiteboardState();

                    });
            this.whitebaordCanvas.on('object:modified', function(event) {
                context.shareCanvasObject(event.target, event.target.id);
                context.changeWhiteboardStates(true);
                context.updateWhiteboardState();
            });
            this.whitebaordCanvas.on('selection:created', function (event) {
                colorPicker.style.display = 'block';
                context.activeObject = context.getActiveObject();
                context.objectId =event.target.id;
            });
            this.whitebaordCanvas.on('selection:cleared', function () {
             colorPicker.style.display = 'none';
            });

            this.whitebaordCanvas.on("path:created", function(object){
                object.path.id = new Date().getUTCMilliseconds()
                context.shareCanvasObject(object.path, object.path.id);
                context.changeWhiteboardStates(true);
                context.updateWhiteboardState();
              });
        },

        setObjectFillColor(){
             document.getElementById('color').addEventListener('change',()=>{
                   this.activeObject.set("fill", this.objectColor)
                   this.shareCanvasObject(this.activeObject,this.objectId)
                   this.whitebaordCanvas.renderAll()
                });
        },

        getActiveObject(){
            return this.whitebaordCanvas.getActiveObject() == null ? this.whitebaordCanvas.getActiveGroup() : this.whitebaordCanvas.getActiveObject()
        },

        shareCanvasObject(whiteboardItem, id){
            axios.post('/draw',{canvas:JSON.stringify(whiteboardItem.toObject(['id'])),id:id}).then((data)=>{
                                
                });
        },

        setStringJsonToCanvas(jsonString,id){
            this.deleteCanvasItem(id);
            var context = this;
            var jsonObject = JSON.parse(jsonString);
            fabric.util.enlivenObjects([jsonObject], function (enlivenedObjects) {
                context.deactivateWhiteboardListeners();
                enlivenedObjects.forEach(function (obj) {
                     context.whitebaordCanvas.setActiveObject(obj)
                     context.whitebaordCanvas.add(obj);
                });
                context.whitebaordCanvas.renderAll();
                context.whiteboardListeners();
            });
        },

        deleteCanvasItem(id){
            var context = this;
            this.whitebaordCanvas.getObjects().forEach(function(object) {
                if(object.id === id) {
                   context.whitebaordCanvas.remove(object);
                }

                
            })
        },

       // Undo or redo whitebaordCanvas
        canvasRedoOrUndo(actionType, fromPusher = false){
           if(actionType === 'undo'){
            if(!fromPusher){
                this.sendUndoRedoRequest('undo');
            }
            if (this.canvasMods < this.canvasStates.length - 1) {
                this.whitebaordCanvas.clear().renderAll();
                this.deactivateWhiteboardListeners();
                this.whitebaordCanvas.loadFromJSON(this.canvasStates[this.canvasStates.length - 1 - this.canvasMods - 1]);
                this.whiteboardListeners();
                this.whitebaordCanvas.renderAll();
                this.canvasMods += 1;
            }
            }else if(actionType === 'redo'){
            if(!fromPusher){
                this.sendUndoRedoRequest('redo');
             }
            if (this.canvasMods > 0) {
                this.whitebaordCanvas.clear().renderAll();
                this.deactivateWhiteboardListeners();
                this.whitebaordCanvas.loadFromJSON(this.canvasStates[this.canvasStates.length - 1 - this.canvasMods + 1]);
                this.whiteboardListeners();
                this.whitebaordCanvas.renderAll();
                this.canvasMods -= 1; 
            }
           }else if(actionType === 'clear'){
            if(!fromPusher){
                this.sendUndoRedoRequest('clear');
             }
           }

        },

        changeWhiteboardStates(save) {
            if (save === true) {
                var newJson = JSON.stringify(this.whitebaordCanvas);
                this.canvasStates.push(newJson);
            }
        },

        sendUndoRedoRequest(action){
           axios.post('/undoredo',{action:action}).then((n)=>{
           });
        },

        deactivateWhiteboardListeners(){
            this.whitebaordCanvas.off('object:added');
            this.whitebaordCanvas.off('object:removed');
            this.whitebaordCanvas.off('object:modified');
            this.whitebaordCanvas.off('path:created');
       },

        // Export whitebaordCanvas to png

        exportToPng() {
            this.whitebaordCanvas.forEachObject(obj => {
                obj.selectable = false;
                obj.evented = false;
            });  
            let downloadLink = document.createElement('a');
            downloadLink.setAttribute('download', 'CanvasAsImage.png');
            let whitebaordCanvas = document.getElementById('mainCanvas');
            whitebaordCanvas.toBlob(function(blb) {
            let url = URL.createObjectURL(blb);
            downloadLink.setAttribute('href', url);
            downloadLink.click();
            });
          },


        //   Check if the leader is active

        monitoringLeaderPresence(members){
            var doesLeaderExist = members.filter((user) => user.isAdmin).length > 0 ;
            if(!doesLeaderExist){
                window.location.href ='/vote';
            }
        },


        // Update whiteboar state

        newWhiteboard(member,whiteboardName){
            if(member.isAdmin){
                this.deactivateWhiteboardListeners();
                this.whitebaordCanvas.clear();
                this.createCanvasGrid();
                this.whiteboardListeners();

                axios.post('/whiteboard',{name:whiteboardName,canvas:JSON.stringify(this.whitebaordCanvas.toObject(['id']))}).then(()=>{
                }).catch((error)=>{
                })
            }
        },

        // update whiteboard

        updateWhiteboardState(){
               axios.post('/update/whiteboard',{canvas:JSON.stringify(this.whitebaordCanvas.toObject(['id']))}).then(()=>{
            }).catch((error)=>{
            })
           
        },

        // get current state
        getCurrentState(){
                this.deactivateWhiteboardListeners();
                axios.get('/currentstate').then((data)=>{
                    this.whitebaordCanvas.clear().renderAll();
                    var parsedJson = JSON.parse(data.data.canvas);
                    let context = this;
                    fabric.util.enlivenObjects(parsedJson.objects, function (enlivenedObjects) {
                        context.deactivateWhiteboardListeners();
                        context.createCanvasGrid();
                        enlivenedObjects.forEach(function (object) {
                            if(object.get('type') !== 'group'){
                                context.whitebaordCanvas.setActiveObject(object)
                                context.whitebaordCanvas.add(object);
                            }
                            
                        });
                        context.whitebaordCanvas.renderAll();
                        context.whiteboardListeners();
                    });
                }).catch((error)=>{
                })
                this.whiteboardListeners();
        },

        // Request to draw
        requestToDraw(){
           this.$Progress.start();
           axios.post('/drawrequest').then(()=>{
               this.$swal('Sent','Request sent successfully !!!','success');
               this.$Progress.finish();
           }).catch((error)=>{
               this.$Progress.fail();
               this.$swal('Sorry !',error.message,'error');
           })
        },

        endDrawSession(id,uid){
            this.$Progress.start();
            if(this.drawQueue.length < 1){
                this.$swal('Oops','The drawing queue is empty !!!','info');
            }else{
                axios.post(`/terminate/${id}/${uid}`).then((data)=>{
                    let member = data.data;
                    this.currentUsers.forEach(cuser => {
                        if(cuser.id === member.id){
                            member.canEdit = false;
                        }
                    });
                this.deleteRequestFromQueue();
                    this.$swal('Terminated','Session was destroyed successfully !!!','success');
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

        // delete draw request from the queue
        deleteRequestFromQueue(){
            this.drawQueue.shift();
        },

        createNewWhiteboard(name){
            this.$Progress.start();
            axios.post('/newcanvas',{name:name}).then(()=>{
                this.$swal('Success','New whitebaordCanvas was created !!!','success');
                this.$Progress.finish();
            }).catch((error)=>{
                this.$Progress.fail();
                this.$swal('Sorry !',error.message,'error');
            })
        },

        // open recent
        openRecentWhiteboard(id){
            this.$Progress.start();
            axios.post(`/openrecent/${id}`).then(()=>{
                this.$Progress.finish();
            }).catch((error)=>{
                this.$Progress.fail();
                this.$swal('Sorry !',error.message,'error');
            })
        }
    
}