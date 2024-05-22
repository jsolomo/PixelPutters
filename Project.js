import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

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
            // pointer: new defs.Triangle()


            // Creating a Lake
            lake: new defs.Square(1,1,1),
            sun: new defs.Subdivision_Sphere(4),

            // Creating a Fish
            fish_body: new defs.Subdivision_Sphere(3),
            fish_tail: new defs.Square(1,1,1),
        };

        // *** Materials
        this.materials = {
            test: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            test2: new Material(new Gouraud_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#7CFC00")}),
            ring: new Material(new Ring_Shader()),

            ball: new Material(new defs.Phong_Shader(),{ambient: 0.5, diffusivity: 0.5,specularity: 0.5, color:  hex_color("#ffffff")}),
            target: new Material(new defs.Phong_Shader(),
            {ambient: 1, diffusivity: 1, color: color(1, 0, 0, 1)}),

            // Creating a Sun and Sky
            sun: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 1, specularity: 0, color: hex_color("#ffffff")}),

            // Creating a Ground
            ground: new Material(new Gouraud_Shader(),
            {ambient: 0.5, diffusivity: 0.5, color: hex_color("#7CFC00")}),

            // Creating a Lake
            lake: new Material(new defs.Phong_Shader(),
            {ambient: 1, diffusivity: 1, color: hex_color("#00DCEC")}),

            // Creating a Fish
            fish_body: new Material(new Gouraud_Shader(), {ambient: 0.5, diffusivity: 0.5, color: hex_color("#7CFC00")}),
            fish_tail: new Material(new Gouraud_Shader(), {ambient: 0.5, diffusivity: 0.5, color: hex_color("#7CFC00")}),
        }

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, -100), vec3(0, 0, 0), vec3(0, 1, 0));

        //number of bounces
        this.num_bounce = 0;
        this.xpos = 0;
        this.ypos = 0;
        this.zpos = 0;
        this.wpos =0;
        this.targets_hit = 0;
        

        // Generate random target coordinates across the field
        this.target_coords = [[-255/5, 0, false]];
            for (let j = 0; j<50; j = j+5){
                let y_coord = Math.random() * 30 + (-15);
                let x_coord = Math.random() * 5 + j;
                this.target_coords.push([x_coord, y_coord, false]);
            }

    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("View solar system", ["Control", "0"], () => this.attached = () => null);
        this.new_line();
        this.key_triggered_button("Attach to planet 1", ["Control", "1"], () => this.attached = () => this.planet_1);
        this.key_triggered_button("Attach to planet 2", ["Control", "2"], () => this.attached = () => this.planet_2);
        this.new_line();
        this.key_triggered_button("Attach to planet 3", ["Control", "3"], () => this.attached = () => this.planet_3);
        this.key_triggered_button("Attach to planet 4", ["Control", "4"], () => this.attached = () => this.planet_4);
        this.new_line();
        this.key_triggered_button("Attach to moon", ["Control", "m"], () => this.attached = () => this.moon);
        this.new_line();

    }

    
    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        // Creating Our Light Source
        const light_position = vec4(0, 100, 50, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1e9)];

        //time
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        //Mass of ball
        const m_ball = 0.046; // kg

        //Moments of inertia
        const I_club = 1.28; //kg *m^2
        const I_ball = 8.5054*10**(-6);//kg *m^2
        
        //Radius of the ball
        const r = 0.43/2 ; //m


        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        let model_transform = Mat4.identity();

    
        let theta = Math.PI/2;
        let gamma = Math.PI/2;
        let phi = Math.PI;

        //Gravitational Constant
        const g= 9.81; // m/s^2
        
        //Inital velocity of the Ball

        let v_0 = Math.sqrt((24.90*(phi*180/Math.PI)*0.05)/(((1/2)*m_ball*Math.sin(gamma))+((1/2)*I_ball*(1/(r**2))*Math.cos(gamma))));
        let v_0x = v_0*Math.cos(40*Math.PI/180)*Math.sin(gamma);
        let v_0y = v_0*Math.sin(40*Math.PI/180)*Math.sin(gamma);
        let v_0z = v_0*Math.cos(40*Math.PI/180)*Math.sin(gamma);


        //Displacement


        //x-direction
        let x_t =v_0x*t*Math.cos(theta)-((0.2*g/2)*(t*Math.sin(theta))**2);
        let v_xt =v_0x*Math.cos(theta)-(0.2*g)*t*Math.sin(theta);


        //y-direction

        let a = (1/(2*g))*(v_0y**2);
        let omega_n = (2*Math.PI*g)/(v_0y);
        let alpha = 0.4;
        
        let y_t =Math.abs(a*Math.sin(omega_n*t)*Math.exp(-1*alpha*omega_n*t));

        //z-direction
        let z_t =v_0x*t*Math.cos(theta)-((0.2*g/2)*(t*Math.cos(theta))**2);
        let v_zt =v_0x*Math.cos(theta)-(0.2*g)*t*Math.cos(theta);

        //rotation
        let omega_ball = (v_0*Math.cos(gamma))/r;
        let omega_t = omega_ball*t-(22.813/2)*t**2;

        

         if(this.num_bounce < 4){
             if(y_t <= 10**(-2)){
                this.num_bounce = this.num_bounce + 1;
                this.xpos =x_t;
                this.ypos= y_t;
                this.zpos = z_t;
                this.wpos = omega_t;
             }
         }
        else{
            
            y_t = 0;

            if(v_xt <0 && v_zt <0){
                x_t = this.xpos;
                z_t = this.zpos;
                omega_t =this.wpos;
            }
            else if(v_xt <0 && v_zt >=0){
                x_t = this.xpos;
                
            }
            else if(v_xt >=0 && v_zt <0){
                z_t = this.zpos;
            }

            this.xpos =x_t;
            this.ypos= y_t;
            this.zpos = z_t;
            this.wpos = omega_t;

    

    
        }
        
        
        let model_transform_ball = model_transform.times(Mat4.translation(x_t,y_t,-z_t,1)).times(Mat4.rotation(omega_t,1,0,0));
        let model_transform_ground = model_transform.times(Mat4.rotation(Math.PI/2,1,0,0)).times(Mat4.translation(0,0,1,1)).times(Mat4.scale(1000,100,1000,1));
        let model_transform_sky = model_transform.times(Mat4.rotation(0,1,0,0)).times(Mat4.translation(0,0,-1000,1)).times(Mat4.scale(100,100,100,1));
        let model_transform_target = model_transform.times(((Mat4.scale(5, 0, 5, 1)).times(Mat4.rotation(Math.PI/2,1,0,0))));
        


        let eye_x=x_t-30;
        let eye_y=y_t+5;
        let eye_z=-z_t-20;

        //let camera_location = Mat4.look_at(vec3(eye_x,eye_y,eye_z),vec3(x_t,y_t,-z_t),vec3(0,1,0));
        //program_state.set_camera(camera_location);

        this.shapes.ball.draw(context,program_state,model_transform_ball,this.materials.ball);
        // this.shapes.ground.draw(context,program_state,model_transform_ground,this.materials.test2);
        this.draw_ground(context, program_state);
        // this.draw_lake(context, program_state);
        // this.draw_fish(context, program_state, t, -35, 0, 0, 0);
        // this.draw_fish(context, program_state, t, -35, 0, 0, 10);

        // Generate All Targets
        for (let i = 0; i < this.target_coords.length; i++){
            let model_transform_target_translated =  model_transform_target.times(Mat4.translation(this.target_coords[i][0],this.target_coords[i][1],0));
            let target_i_material = this.materials.target;
            // let model_transform_target_translated_pointer =  model_transform.times((Mat4.translation(0,5,0))).times(model_transform_target_translated);

            // If ball has hit target
            if (!this.target_coords[i][2] && (x_t >= this.target_coords[i][0]*5 - 5 && x_t <= this.target_coords[i][0]*5 + 5) && (this.target_coords[i][1]*5 >= 0 - 5 && this.target_coords[i][1]*5 <= 0 + 5) && y_t == 0){
                this.target_coords[i][2] = true;
                this.targets_hit++;
            }
            // If Target was already hit before
            if (this.target_coords[i][2]){
                target_i_material = this.materials.target.override({color: hex_color("#00FF00")});
            }
            this.shapes.circle.draw(context,program_state,model_transform_target_translated,target_i_material);
            // this.shapes.pointer.draw(context,program_state,model_transform_target_translated_pointer,this.materials.target);
        }
     

    }
    draw_fish(context, program_state, t, a, b, c, time_scale){
        let fish_transform = Mat4.identity();
        let time = t - time_scale;
        let angular_velocity = 1;
        let x = Math.cos(angular_velocity * time);
        let y = Math.sin(angular_velocity * time);
        let theta = 2 * Math.atan(y/x) + Math.PI;
        fish_transform = fish_transform.times(Mat4.rotation(-theta, 0, 0, 1))
            .times(Mat4.translation(a, b, c))
            .times(Mat4.rotation(-0.005 * theta + Math.PI/2, 0, 0, 1))
            .times(Mat4.scale(4, 2, 0.5));
        if(time >= 0){
            this.shapes.fish_body.draw(context, program_state, fish_transform, this.materials.fish_body);
        }
    }
    
    draw_ground(context, program_state) {
        let model_transform_ground = Mat4.identity().times(Mat4.rotation(Math.PI/2,1,0,0)).times(Mat4.translation(0,0,1,1)).times(Mat4.scale(1000,100,1000,1));
        // ground_transform = ground_transform.times(Mat4.scale(1000,10,1000,1))
        // .times(Mat4.rotation(Math.PI/2,1,0,0));
        this.shapes.ground.draw(context, program_state, model_transform_ground, this.materials.ground);
    }
    
    draw_lake(context, program_state){
        for(let x = -20; x < 20; x++) {
            for (let z = -10; z < 10; z++) {
                const distance = Math.sqrt((x - 0) ** 2 + (z - 0) ** 2);
                // console.log(distance)
                if (distance < 20){
                    let lake_transform = Mat4.identity();
                    lake_transform = lake_transform.times(Mat4.translation(x * 20, 2.5, z * 20))
                    .times(Mat4.scale(10,5,10)).times(Mat4.rotation(Math.PI/2, 1, 0,0));
                    this.shapes.lake.draw(context,program_state,lake_transform,this.materials.lake);
                }
            }
        }
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

