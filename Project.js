import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;

const {Cube, Axis_Arrows, Textured_Phong} = defs

export class Assignment3 extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            torus: new defs.Torus(15, 15),
            torus2: new defs.Torus(3, 15),
            sphere: new defs.Subdivision_Sphere(4),
            circle: new defs.Regular_2D_Polygon(1, 15),
            ball: new defs.Subdivision_Sphere(4),
            ground: new defs.Square(1,1,1),
            sky: new defs.Square(1,1,1),
            pointer: new defs.Triangle(),
            bar: new defs.Square(),
            cube: new defs.Cube(),
            square: new defs.Square(),


            // Creating a Lake
            lake: new defs.Square(1,1,1),
            sun: new defs.Subdivision_Sphere(4),

            // Creating a Fish
            fish_body: new defs.Subdivision_Sphere(2),
            fish_tail: new defs.Cube(),

            //Creating a Tree
            tree_stalk: new defs.Cube(),
            tree_head: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(2),

        };

        // *** Materials
        this.materials = {
            test: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            test2: new Material(new Gouraud_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#7CFC00")}),
            ring: new Material(new Ring_Shader()),

            ball: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 0.9,
                texture: new Texture("assets/ball.jpg")
            }),
            target: new Material(new defs.Phong_Shader(),
            {ambient: 1, diffusivity: 1, color: color(1, 0, 0, 1)}),

            // Creating a Sun and Sky
            sun: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 1, specularity: 0, color: hex_color("#ffffff")}),

            fake_sun: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1,
                texture: new Texture("assets/sun.webp")}),

            // Creating a Ground
            //ground: new Material(new Gouraud_Shader(),
            //{ambient: 0.5, diffusivity: 0.5, color: hex_color("#7CFC00")}),

            ground: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1,
                texture: new Texture("assets/grass.png")
            }),

            // Creating a Lake
            //lake: new Material(new defs.Phong_Shader(),
            //{ambient: 1, diffusivity: 1, color: hex_color("#00DCEC")}),

            lake: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1,
                texture: new Texture("assets/lake.jpeg")
            }),

            // Creating a Fish
            fish_body: new Material(new Gouraud_Shader(), {ambient: 0.5, diffusivity: 0.5, specularity: 0, color: hex_color("#FFA500")}),
            fish_tail: new Material(new Gouraud_Shader(), {ambient: 0.5, diffusivity: 0.5, specularity: 0, color: hex_color("#000000")}),

            //Creating a Tree
            //tree_stalk: new Material(new Gouraud_Shader(), {ambient: 0.5, diffusivity: 0.5, color: hex_color("#725C42")}),
            tree_stalk: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, specularity: 0, diffusivity:0,
                texture: new Texture("assets/stalk.jpeg")
            }),
            tree_head: new Material(new Gouraud_Shader(), {ambient: 0.5, diffusivity: 0.5, specularity: 0, color: hex_color("#8fa93a")}),

            //tall grass
            tall_grass: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, specularity: 0, diffusivity:0,
                texture: new Texture("assets/tallgrass.webp")}),
            mountains: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, specularity: 0, diffusivity:0,
                texture: new Texture("assets/mountains.png")}),
            forest: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, specularity: 0, diffusivity:0,
                texture: new Texture("assets/forest.png")}),
            city: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, specularity: 0, diffusivity:0,
                texture: new Texture("assets/city.webp")}),
            flag: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, specularity: 0, diffusivity:0,
                texture: new Texture("assets/flag.png")}),

            pointer: new Material(new defs.Phong_Shader(),
            {ambient: 1, diffusivity: 1, color: hex_color("#FFFF00")}),
            bar: new Material(new defs.Phong_Shader(),
            {ambient: 1, diffusivity: 1, color: hex_color("#ADD8E6")}),
            scoreboard: new Material(new defs.Phong_Shader(),
            {ambient: 1, diffusivity: 0, specularity: 0, color: hex_color("#FFE36E")}),
            texture: new Material(new Textured_Phong(), {
                color: color(0, 0, 0, 1),
                ambient: 1,
                texture: new Texture("assets/sky.jpg")
            }),
        }

        this.initial_camera_location = Mat4.look_at(vec3(-450, 10, 0), vec3(0, 0, 0), vec3(1, 0, 0));
        //this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));

        //number of bounces
        this.num_bounce = 0;
        this.xpos = -445;
        this.ypos = 1;
        this.zpos = 0;
        this.wpos =0;
        this.targets_hit = 0;
        this.ball_hit = false;
        this.turn_angle= 0;
        this.x_t =-445;
        this.y_t = 1;
        this.z_t = 0;
        this.stopped = false;
        this.hold = 0;
        this.omega_t = 0;
        this.time = 0;
        this.power_selected = false;
        this.power_angle = 0;
        this.level = 0;
        this.lakecoords = [];
        this.treecoords = [];
        this.firstpass = true;
        this.firstpasstree =true;

        this.turn = function(dir) {
            // 0 = right, 1 = left
            if (this.ball_hit){
                return;
            }
            if (dir == 0 && this.turn_angle > -Math.PI/4){
                this.turn_angle = this.turn_angle - Math.PI/20;
            }
            else if (dir == 1 && this.turn_angle < Math.PI/4){
                this.turn_angle = this.turn_angle + Math.PI/20;
            }
            if (this.turn_angle > Math.PI/4){
                this.turn_angle = Math.PI/4;
            }
            else if(this.turn_angle < -Math.PI/4){
                this.turn_angle = -Math.PI/4;
            }
        }
        

        // Generate random target coordinates across the field
        this.target_coords = [];
        if (this.level == 0){
            this.level++;
            this.get_new_coords();
        }

        this.draws = [];
        this.dxs = [];
        this.dzs = [];
        for(let u = -450; u < 450; u += 75){
            for(let v = -450; v < 450; v+= 50){
                let draw = Math.floor(Math.random() * 3) + 1;
                let dx = (Math.random() * 25);
                let dy = (Math.random() * 35);

                this.draws.push(draw);
                this.dxs.push(dx);
                this.dzs.push(dy);
            }
        }
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Aim Left", ["q"], () => this.turn(1));
        this.key_triggered_button("Aim Right", ["e"], () => this.turn(0));
        this.key_triggered_button("Hit Ball", ["h"], () => {
            if (!this.ball_hit){
                this.ball_hit = true;
            }
            else if (!this.power_selected){
                this.power_selected = true;
            }
        });
        this.key_triggered_button("Quick Restart", ["r"], () => {
            this.ball_hit = false;
            this.power_selected = false;
        });
        // this.key_triggered_button("Attach to moon", ["Control", "m"], () => this.attached = () => this.moon);
        this.new_line();

    }

    
    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, .1, 1000);
        
        // Getting the time
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        // Setting up the lights
        const light_position = vec4(0, 100, 0, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1e9)];

        let model_transform = Mat4.identity();
        this.update_ball_coord(t);
        this.generate_powermeter(context, program_state, t);

  
        let ball_transform = model_transform.times(Mat4.translation(this.x_t,this.y_t,-this.z_t,1)).times(Mat4.rotation(-this.turn_angle,1,-1,0)).times(Mat4.rotation(this.omega_t,0,0,-1));
        let model_transform_ground = model_transform.times(Mat4.rotation(Math.PI/2,1,0,0)).times(Mat4.translation(0,0,1,1)).times(Mat4.scale(1000,100,1000,1));
        let model_transform_sky = model_transform.times(Mat4.rotation(0,1,0,0)).times(Mat4.translation(0,0,-1000,1)).times(Mat4.scale(100,100,100,1));
        let model_transform_target = model_transform.times(((Mat4.scale(5, 0, 5, 1)).times(Mat4.rotation(Math.PI/2,1,0,0))));
        


        let eye_x = this.x_t - 10;
        let eye_y = this.y_t + 2;
        let eye_z =-this.z_t;
        let camera_location;
        if(this.ball_hit && this.power_selected){
            camera_location =  Mat4.look_at(vec3(eye_x,eye_y,eye_z),vec3(this.x_t,this.y_t,-this.z_t),vec3(0,1,0));
            program_state.set_camera(camera_location);
        }
        else {
            let aim_vec = vec3(Math.cos(-this.turn_angle) * 200, 1, Math.sin(-this.turn_angle) * 200);
            camera_location = Mat4.look_at(vec3(-455,3,0),aim_vec,vec3(0,1,0));
            program_state.set_camera(camera_location);
            let pointer_rotation = Mat4.rotation(Math.PI/2,1,0,0).times(Mat4.rotation(Math.PI/1.3,0 , 0, 1));
            let pointer_rotation_2 = Mat4.rotation(-this.turn_angle, 0, this.turn_angle, 1)
            if (this.turn_angle >= 0){
                pointer_rotation_2 = Mat4.rotation(this.turn_angle, 0, this.turn_angle, 1)
            }
            // this.shapes.pointer.draw(context,program_state, Mat4.translation(3*Math.cos(-this.turn_angle), 0, 3*Math.sin(-this.turn_angle)).times(Mat4.translation(0,1,0)).times(Mat4.scale(3,1,3)).times(pointer_rotation_2).times(pointer_rotation), this.materials.pointer);
        }


        this.shapes.ball.arrays.texture_coord.forEach((v,i,l)=>v[0]=v[0]*3);
        this.shapes.ball.arrays.texture_coord.forEach((v,i,l)=>v[1]=v[1]*3);
        this.shapes.ball.draw(context, program_state, ball_transform, this.materials.ball);

        
        this.draw_ground(context, program_state, 500);
        this.draw_lake(context, program_state, 20, 10);
        this.draw_tree(context, program_state);
        this.draw_fish(context, program_state, t, -100, 0, 350, 0);
        let sky_transformation = Mat4.inverse(program_state.camera_inverse).times(Mat4.scale(900,400,900));
        this.shapes.cube.draw(context, program_state, sky_transformation, this.materials.texture);
        this.draw_mountains(context,program_state);
        this.draw_tallgrass(context,program_state);
        this.draw_sun(context, program_state,t);
        this.draw_forest(context, program_state);
        this.draw_city(context, program_state);

        // Generate All Targets
        /*for (let i = 0; i < this.target_coords.length; i++){
            let model_transform_target_translated =  model_transform_target.times(Mat4.translation(this.target_coords[i][0],this.target_coords[i][1],0));
            let target_i_material = this.materials.target;
            if (!this.target_coords[i][2] && (this.x_t >= model_transform_target_translated[0][3]-5 && this.x_t <= model_transform_target_translated[0][3] + 5) && (this.z_t >= -model_transform_target_translated[2][3]  - 5 && this.z_t <= -model_transform_target_translated[2][3] + 5) && this.y_t <= 0.5){
                this.target_coords[i][2] = true;
                this.targets_hit++;
            }
            // If Target was already hit before
            if (this.target_coords[i][2]){
                target_i_material = this.materials.target.override({color: hex_color("#00FF00")});
            }
            this.shapes.circle.draw(context,program_state,model_transform_target_translated,target_i_material);
        }*/
        this.generate_targets(context, program_state);
     

    }

    update_ball_coord(t){
        //Ball and Club Properties
        const m_ball = 0.046; // kg
        const I_club = 1.28; //kg *m^2
        const I_ball = 8.5054*10**(-6); //kg *m^2
        const r = 0.43/2; //m


        if (this.ball_hit ==true && this.power_selected ==true && this.stopped == false){
            let time_t = (t - this.time)-2;
            let theta = this.turn_angle;
            let gamma = Math.PI/4;


            if( time_t < 0){
                this.xpos = this.x_t;
                this.ypos = this.y_t;
                this.zpos = this.z_t;
            }
            else{
                   let phi = this.power_angle;
            const g= 9.81; // m/s^2

            let v_0 = Math.sqrt((24.90*(phi*180/Math.PI)*0.05)/(((1/2)*m_ball*Math.sin(gamma))+((1/2)*I_ball*(1/(r**2))*Math.cos(gamma))));
            let v_0x = v_0*Math.cos(40*Math.PI/180)*Math.sin(gamma);
            let v_0y = v_0*Math.sin(40*Math.PI/180)*Math.sin(gamma);

            this.x_t =v_0x*time_t*Math.cos(theta)-((g/8)*(time_t*Math.cos(theta))**2) - 445;
            let v_xt =v_0x*Math.cos(theta)-((g/2)*time_t*Math.cos(theta)**2);

            let a = (1/(2*g))*(v_0y**2);
            let omega_n = (2*Math.PI*g)/(v_0y);
            let alpha = 0.3;
            this.y_t =Math.abs(a*Math.sin(omega_n*time_t)*Math.exp(-1*alpha*omega_n*time_t)) + 1;

            this.z_t =v_0x*time_t*Math.sin(theta)-((g/8)*(time_t*Math.sin(theta))**2);
            let v_zt =v_0x*Math.sin(theta)-((g/4)*time_t*Math.sin(theta)**2);

            let omega_ball = (v_0*Math.cos(gamma))/r;
            this.omega_t = (omega_ball/30)*time_t -((g/2)*time_t*Math.sin(theta)**2);




                
            if(this.num_bounce < 4){
                if(this.y_t <= 1+10**(-2)){
                    this.num_bounce = this.num_bounce + 1;
                    this.xpos =this.x_t;
                    this.ypos= 1;
                    this.zpos = this.z_t;
                    this.wpos = this.omega_t;
                }
            }
            else {
                // this.t = 0;

                
                if(v_xt <0 || v_zt <0){
                    this.x_t = this.xpos;
                    this.z_t = this.zpos;
                    this.y_t = 1;
                    this.omega_t = this.wpos;
                    this.stopped = true;
                    this.ball_hit = false;
                    this.power_selected = false;
                    this.num_bounce = 0;

                }


            this.xpos =this.x_t;
            this.ypos= this.y_t;
            this.zpos = this.z_t;
            this.wpos = this.omega_t;


            
                if (v_xt <= 0 && v_zt <= 0 && this.omega_t == this.wpos){
                    this.stopped = true;
                    this.ball_hit = false;
                    this.power_selected = false;
                    this.num_bounce = 0;
                }
                
                    
               
            }

            
             //ball falls in water
                for(let i = 0; i < this.lakecoords.length; i++){

                    let center_x = this.lakecoords.at(i).at(0);
                    let center_z = -1*this.lakecoords.at(i).at(1);

                    if(center_x-10.1 < this.x_t && center_x+10.1 > this.x_t && center_z -10.1  < this.z_t && center_z+10.1 > this.z_t){
                        if(this.y_t <=2){
                            this.x_t = this.xpos;
                            this.z_t = this.zpos;
                            this.y_t = 1;
                            this.omega_t = this.wpos;
                            this.stopped = true;
                            this.ball_hit = false;
                            this.power_selected = false;
                            this.num_bounce = 0;
                            
                            break;
                        }
                    }
                }

            //ball runs into tree
                 for(let i = 0; i < this.treecoords.length; i++){

                    let center_x = this.treecoords.at(i).at(0);
                    let center_z = -1*this.treecoords.at(i).at(1);

                    if(center_x-5.50 < this.x_t && center_x+5.50 > this.x_t && center_z -5.50  < this.z_t && center_z+5.50 > this.z_t){
                            this.x_t = this.xpos;
                            this.z_t = this.zpos;
                            this.y_t = 1;
                            this.omega_t = this.wpos;
                            this.stopped = true;
                             this.ball_hit = false;
                            this.power_selected = false;
                            this.num_bounce = 0;
                            break;
                        }
                    }
                

            
            // console.log(theta)
            if (t - this.time >= 30){
                this.ball_hit = false;
                this.power_selected = false;
                this.num_bounce = 0;
                v_0= 0;
                v_zt =0;
                
            }
                
            }
        }
        else{

            if(this.hold < 8 && this.stopped==true){
                this.x_t = this.xpos;
                this.z_t = this.zpos;
                this.y_t = 1;
                this.omega_t = this.wpos; 
                this.hold = this.hold+1;
            }
            else if(this.hold > 8 && this.stopped == true){
                this.ball_hit = false;
                this.power_selected = false;
                this.num_bounce = 0;

                 this.x_t =-445;
                this.y_t = 1;
                this.z_t = 0;
                this.stopped = false;
                this.xpos =-445;
                this.ypos =1;
                this.zpos =0;
                this.time = t;
                this.hold = 0;
                
            }
            else
            {
                
                this.x_t =-445;
                this.y_t = 1;
                this.z_t = 0;
                this.stopped = false;
                this.xpos =-445;
                this.ypos =1;
                this.zpos =0;
                this.time = t;
                this.hold = 0;

            }
           
            
        }
    }

    generate_powermeter(context, program_state, t){
        if (this.ball_hit && !this.power_selected) {
            let aim_vec = vec3(Math.cos(-this.turn_angle) * 200 - 450, 3, Math.sin(-this.turn_angle) + 3.25);
            let camera_location = Mat4.look_at(vec3(-450,2,0),aim_vec,vec3(0,1,0));

            let bar_dist = Math.sqrt(25 + (3.5 ** 2));
            let off_set = Math.atan(3/5);
            let angle = this.turn_angle;
            // console.log(off_set);
            let x_aim = Math.cos(-this.turn_angle + off_set) * bar_dist;
            let z_aim = Math.sin(-this.turn_angle + off_set) * bar_dist;

            this.power_angle = -Math.PI/4 * Math.cos((Math.PI) * t) + Math.PI/4;
            const bar_transform = Mat4.identity().times(Mat4.inverse(program_state.camera_inverse).times(Mat4.translation(-3.48, 1, -5.26))).times(Mat4.scale(0.25,1,0.25));
            this.shapes.bar.draw(context, program_state, bar_transform, this.materials.bar);
            const picker_transform = Mat4.identity().times((Mat4.translation(0,-0.9* Math.cos(Math.PI*t) + 0.9, 0).times(Mat4.inverse(program_state.camera_inverse).times(Mat4.translation(-3.48, 0.1, -5.25)).times(Mat4.scale(0.3,0.06,0.2)))));
            this.shapes.bar.draw(context, program_state, picker_transform, this.materials.pointer);
        }
    }

    get_new_coords(){
        this.target_coords = [];
        
        for (let j = 0; j < 4; j++){
            console.log(this.level)
            let z_coord = Math.random() * (-40) + (-30);
            let x_coord;
            if (this.level == 1){
                x_coord = Math.random() * 15 + 20;
            }
            else if (this.level == 2){
                x_coord = Math.random() * 15 + 40;
            }
            else {
                if (z_coord <= 5 && z_coord >= -2){
                    x_coord = Math.random() * 15 + 20;
                }
                else if (z_coord >= -2 && z_coord >= 60-110){
                    x_coord = Math.random() * 35 + 20;
                }
                else if (z_coord >= -60-100){
                    x_coord = Math.random() * 70 + 20;
                }
                else {
                    x_coord = Math.random() * 15 + 20;
                }
            }
            this.target_coords.push([x_coord, z_coord, false]);
        }
    }

    generate_targets(context, program_state, level){ // Finish Target functionality by changing colors and also recognizing hits
        const scoreboard_transformation = Mat4.identity().times(Mat4.inverse(program_state.camera_inverse).times(Mat4.translation(3.48, 1.5, -5))).times(Mat4.scale(2,0.5,0.25));
        this.shapes.bar.draw(context, program_state, scoreboard_transformation, this.materials.scoreboard);
        for (let i = 0; i < this.target_coords.length; i++){
            let transform = Mat4.identity();
            
            let flag_transform = transform
            .times(Mat4.translation(-450 + this.target_coords[i][0], 0, this.target_coords[i][1] + 50))
            .times((Mat4.scale(5, 5, 5)))
            .times(Mat4.rotation(Math.PI/2,0,1,0));

            
            
            transform = transform
                .times(Mat4.translation(-450 + this.target_coords[i][0], 0.5, this.target_coords[i][1] + 50))
                .times((Mat4.scale(5, 0, 5, 1)))
                .times(Mat4.rotation(Math.PI/2,1,0,0));

        
                // .times(((Mat4.scale(5, 0, 5, 1))
                // .times(Mat4.rotation(Math.PI/2,1,0,0))))
                // .times(Mat4.translation(-450 + this.target_coords[i][0], 0.75, this.target_coords[i][1] + 50))

            let target_i_material = this.materials.target;
            // console.log(vec3(this.x_t, this.y_t, this.z_t))
            // console.log(transform)
            if (!this.target_coords[i][2] && (this.x_t >= transform[0][3]-5 && this.x_t <= transform[0][3] + 5 ) && (this.z_t >= -transform[2][3]  - 5  && this.z_t <= -transform[2][3] + 5 ) && this.y_t <= 1.5){
                this.target_coords[i][2] = true;
                this.targets_hit++;
            }
            // If Target was already hit before
            if (this.target_coords[i][2]){
                target_i_material = this.materials.target.override({color: hex_color("#00FF00")});
            }
            this.shapes.circle.draw(context,program_state,transform,target_i_material);
            this.shapes.square.draw(context,program_state,flag_transform,this.materials.flag);
            const point_transformation = Mat4.identity().times(Mat4.inverse(program_state.camera_inverse).times(Mat4.translation(3.4 - (i*0.5), 1.5, -4.999))).times(Mat4.scale(0.1,0.1,0.1));
            this.shapes.bar.draw(context, program_state, point_transformation, target_i_material);
            if (this.targets_hit == 4){
                this.targets_hit = 0;
                this.level++;
                this.ball_hit = false;
                this.power_selected = false;
                this.get_new_coords();
                
            }
        }
    }

    draw_fish(context, program_state, t, a, b, c, time_scale){
        let fish_transform = Mat4.identity();
        let time = t - time_scale;
        let angular_velocity = 1;
        let x = Math.cos(angular_velocity * time);
        let y = Math.sin(angular_velocity * time);
        let theta = 2 * Math.atan(y/x) + Math.PI;
        fish_transform = fish_transform.times(Mat4.translation(a, b, 100))
            .times(Mat4.rotation(-theta, 1, 0, 0))
            .times(Mat4.translation(a, b, 25))
            .times(Mat4.rotation(-0.25 * theta + Math.PI/4, 1, 0, 0))
            .times(Mat4.scale(4, 2, 0.5));

        let tail_transform = Mat4.identity().times(Mat4.translation(a, b, 100))
            .times(Mat4.rotation(-theta, 1, 0, 0))
            .times(Mat4.translation(a-1, b - 2, 25-0.5))
            .times(Mat4.rotation(-0.25 * theta + Math.PI/4, 1, 0, 0))
            .times(Mat4.scale(1, 2, 0.5));
        
        if(time >= 0){
            this.shapes.fish_body.draw(context, program_state, fish_transform, this.materials.fish_body);
            this.shapes.fish_tail.draw(context, program_state, tail_transform, this.materials.fish_tail);
        }
    }

    draw_tree(context, program_state){
        let count = 0;
        let height = 40;
        for(let z = -450; z < 450; z += 75){
            for(let x = -450; x < 250; x+= 50){
                if (z < -250 || z > 350){
                    if (this.draws[count] != 3) {
                        let transform = Mat4.identity();
                        transform = transform.times(Mat4.translation(x + this.dxs[count], height, z + this.dzs[count])).times(Mat4.scale(5, height, 5));
                        this.shapes.tree_stalk.draw(context, program_state, transform, this.materials.tree_stalk);

                        transform = Mat4.identity();
                        transform = transform.times(Mat4.translation(x + this.dxs[count], 2 * height, z + this.dzs[count])).times(Mat4.scale(35, 35, 40));
                        this.shapes.tree_head.draw(context, program_state, transform, this.materials.tree_head);


                            if(this.firstpasstree == true){
                              this.treecoords.push([x + this.dxs[count], z + this.dzs[count]]);  
                            }
                    }
                }
                count = count + 1;
            }
        }
        this.firstpasstree = false;
    }

    draw_tallgrass(context, program_state){
        let count = 0;
        let height = 2;
        for(let z = -450; z < -200; z += 50){
            for(let x = -450; x < 450; x+= 50){
                if (z < -250 || z > -100){
                    if (this.draws[count] != 3) {
                        let transform = Mat4.identity();

                        transform = transform.times(Mat4.translation(x + this.dxs[count], height, z + 10*this.dzs[count])).times(Mat4.scale(2, 5, 2)).times(Mat4.rotation(Math.PI/2,0,1,0));
                        this.shapes.square.draw(context, program_state, transform,this.materials.tall_grass);
                    }
                }
                count = count + 1;
            }
        }
    }

    draw_sun(context, program_state,t){
        let transform = Mat4.identity().times(Mat4.translation(375, 150+20*Math.cos(t),100)).times(Mat4.scale(100, 100, 100)).times(Mat4.rotation(Math.PI/2,0,1,0));
        this.shapes.square.draw(context, program_state, transform,this.materials.fake_sun);
    }
    draw_city(context, program_state){
        let transform = Mat4.identity().times(Mat4.translation(300, 20,175)).times(Mat4.scale(100, 100, 100)).times(Mat4.rotation(Math.PI/2,0,1,0));
        this.shapes.square.draw(context, program_state, transform,this.materials.city);
        transform = Mat4.identity().times(Mat4.translation(275, 20,275)).times(Mat4.scale(50, 50, 50)).times(Mat4.rotation(Math.PI/2,0,1,0));
        this.shapes.square.draw(context, program_state, transform,this.materials.city);
        transform = Mat4.identity().times(Mat4.translation(260, 12,325)).times(Mat4.scale(25, 25, -25)).times(Mat4.rotation(Math.PI/2,0,1,0));
        this.shapes.square.draw(context, program_state, transform,this.materials.city);
        transform = Mat4.identity().times(Mat4.translation(260, 15,120)).times(Mat4.scale(30, 30, -30)).times(Mat4.rotation(Math.PI/2,0,1,0));
        this.shapes.square.draw(context, program_state, transform,this.materials.city);
        transform = Mat4.identity().times(Mat4.translation(260, 35,350)).times(Mat4.scale(75, 75, 75)).times(Mat4.rotation(Math.PI/4,0,1,0));
        this.shapes.square.draw(context, program_state, transform,this.materials.city);
    }

    draw_mountains(context, program_state){
        let transform = Mat4.identity().times(Mat4.translation(360,100,-100)).times(Mat4.scale(200,200, 200)).times(Mat4.rotation(Math.PI/2,0,1,0));
        this.shapes.square.draw(context, program_state, transform,this.materials.mountains);
        transform = Mat4.identity().times(Mat4.translation(350,50,-250)).times(Mat4.scale(100,100, -100)).times(Mat4.rotation(Math.PI/2,0,1,0));
        this.shapes.square.draw(context, program_state, transform,this.materials.mountains);
        transform = Mat4.identity().times(Mat4.translation(200,125,-400)).times(Mat4.scale(250,250, 250)).times(Mat4.rotation(-Math.PI/4,0,1,0));
        this.shapes.square.draw(context, program_state, transform,this.materials.mountains);
        transform = Mat4.identity().times(Mat4.translation(50,75,-450)).times(Mat4.scale(150,150, -150));
        this.shapes.square.draw(context, program_state, transform,this.materials.mountains);
    }


    draw_forest(context, program_state){
        let transform = Mat4.identity().times(Mat4.translation(-200,25,360)).times(Mat4.scale(50,50,50));
        this.shapes.square.draw(context, program_state, transform,this.materials.forest);
        transform = Mat4.identity().times(Mat4.translation(0,25,360)).times(Mat4.scale(50,50,50));
        this.shapes.square.draw(context, program_state, transform,this.materials.forest);  
        transform = Mat4.identity().times(Mat4.translation(-100,25,360)).times(Mat4.scale(50,50,50));
        this.shapes.square.draw(context, program_state, transform,this.materials.forest);  
        transform = Mat4.identity().times(Mat4.translation(100,25,360)).times(Mat4.scale(50,50,50));
        this.shapes.square.draw(context, program_state, transform,this.materials.forest);
    }

     
    

    
    
    draw_ground(context, program_state, size) {
        let ground_transform = Mat4.identity();
        ground_transform = ground_transform.times(Mat4.scale(size,10,size,1))
            .times(Mat4.rotation(Math.PI/2,1,0,0));

        this.shapes.ground.arrays.texture_coord.forEach((v,i,l)=>v[0]=v[0]*50);
        this.shapes.ground.arrays.texture_coord.forEach((v,i,l)=>v[1]=v[1]*50);
        this.shapes.ground.draw(context, program_state, ground_transform, this.materials.ground);
    }
    
    draw_lake(context, program_state, x_rad, y_rad){
        for(let x = -x_rad; x < x_rad; x++) {
            for (let z = -y_rad; z < y_rad; z++) {
                const distance = Math.sqrt((x - 0) ** 2 + (z - 0) ** 2);
                // console.log(distance)
                if (distance < y_rad){
                    let lake_transform = Mat4.identity();
                    lake_transform = lake_transform.times(Mat4.translation(x * 20 - 200, 0.5, z * 20 + 150))
                    .times(Mat4.scale(10,5,10)).times(Mat4.rotation(Math.PI/2, 1, 0,0));
                    this.shapes.lake.draw(context,program_state,lake_transform,this.materials.lake);

                    if(this.firstpass == true){
                      this.lakecoords.push([x * 20 - 200,z * 20 + 150]);  
                    }
                }
            }
        }
        this.firstpass = false;
    }
}
   
class Gouraud_Shader extends Shader {
    // This is a Shader using Phong_Shader as template
    // TODO: Modify the glsl coder here to create a Gouraud Shader (Planet 2)

    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return ` 
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                                               light_positions_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;                            
            // Position is expressed in object coordinates.
            
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
    
            void main(){                                                                   
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;
            } `;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            void main(){                                                           
                // Compute an initial (ambient) color:
                gl_FragColor = vec4( shape_color.xyz * ambient, shape_color.w );
                // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
            } `;
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}

class Ring_Shader extends Shader {
    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
        const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
            Matrix.flatten_2D_to_1D(PCM.transposed()));
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        varying vec4 point_position;
        varying vec4 center;
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        attribute vec3 position;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;
        
        void main(){
          
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        void main(){
          
        }`;
    }
}