// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        // Complete as you see fit.
        add_mode: false,
        current_user_id: -1,
        add_text: "",
        add_date: "",
        add_time: "",
        add_location: "",
        add_max_going: 1000,
        add_tag1: "",
        add_tag2: "",
        add_tag3: "",
        rows: [],
        user_email: user_email,
        current_user_email: "",
        userName : username,
        add_going: 0,
        going_list: [],
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.add_post = function () {
        console.log("add_post called")
        axios.post(add_post_url,
            {
                text: app.vue.add_text,
                date: app.vue.add_date,
                time: app.vue.add_time,
                location: app.vue.add_location,
                max_going: app.vue.add_max_going,
                tag1: app.vue.add_tag1,
                tag2: app.vue.add_tag2,
                tag3: app.vue.add_tag3,
                going: app.vue.add_going,
                going_list: app.vue.add_going_list,
            }
            ).then(function (response) {
            app.vue.rows.unshift({

                id: response.data.id,
                poster: app.vue.current_user_id,
                text: app.vue.add_text,
                name: response.data.name,
                date: app.vue.add_date,
                time: app.vue.add_time,
                location: app.vue.add_location,
                max_going: app.vue.add_max_going,
                tag1: app.vue.add_tag1,
                tag2: app.vue.add_tag2,
                tag3: app.vue.add_tag3,
                going: app.vue.add_going,
                cur_idx: -1,
                going_list: [],
            });
            app.enumerate(app.vue.rows);
            app.reset_form();
            app.set_add_status(false);
        });
    };

    app.add_tags = function () {
        axios.post(add_tags_url,
            {
                tag1: app.vue.add_tag1,
                tag2: app.vue.add_tag2,
                tag3: app.vue.add_tag3,
            }
            ).then(function (response) {
            app.vue.rows.unshift({
                tag1: app.vue.add_tag1,
                tag2: app.vue.add_tag2,
                tag3: app.vue.add_tag3,
            });
            app.enumerate(app.vue.rows);
        });
    };

    app.add_post_tag = function () {
        app.add_tags()
        app.add_post()
    };

    app.is_going = function (row_idx){ // this runs when you click the going button
        let x = app.vue.rows[row_idx];
        app.enumerate(app.vue.rows);
        location.reload(true);
        axios.get(update_going_url, {params: {id: x.id}}).then(function (response) {
            x.going = response.data.going;
        });
    };

    app.is_not_going = function (row_idx){ // this runs when you click the going button
        let x = app.vue.rows[row_idx];
        app.enumerate(app.vue.rows);
        location.reload(true); // works 90%???
        axios.get(update_not_going_url, {params: {id: x.id}}).then(function (response) {
            x.going = response.data.going;
        });
    };

    app.reset_form = function () {
        app.vue.add_text = "";
        app.vue.add_date = "";
        app.vue.add_time = "";
        app.vue.add_location = "";
        app.vue.add_tag1 = "";
        app.vue.add_tag2 = "";
        app.vue.add_tag3 = "";
        app.vue.add_max_going = 1000;
    };

    app.delete_post = function (row_idx) {
        let id = app.vue.rows[row_idx].id;
        axios.get(delete_post_url, {params: {id: id}}).then(function (response) {
            for (let i = 0; i < app.vue.rows.length; i++) {
                if (app.vue.rows[i].id === id) {
                    app.vue.rows.splice(i, 1);
                    app.enumerate(app.vue.rows);
                    break;
                }
            }
            });
    };

    app.set_add_status = function (new_status) {
        app.vue.add_mode = new_status;
    };

    app.upload_file = function (event, row_idx) {
        let input = event.target;
        let file = input.files[0];
        let row = app.vue.rows[row_idx];
        if (file) {
            let reader = new FileReader();
            reader.addEventListener("load", function () {
                // Sends the image to the server.
                axios.post(upload_thumbnail_url,
                    {
                        id: row.id,
                        thumbnail: reader.result,
                    })
                    .then(function () {
                        // Sets the local preview.
                        row.thumbnail = reader.result;

                    });
            });
            reader.readAsDataURL(file);
            location.reload(true);
        }
    };

    // This contains all the methods.
    app.methods = {
        // Complete as you see fit.
        add_post: app.add_post,
        add_tags: app.add_tags,
        add_post_tag: app.add_post_tag,
        set_add_status: app.set_add_status,
        delete_post: app.delete_post,
        is_going: app.is_going,
        upload_file: app.upload_file,
        is_not_going: app.is_not_going,
        
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods
    });

    // And this initializes it.
    app.init = () => {
        // Put here any initialization code.
        // Typically this is a server GET call to load the data.
        axios.get(load_posts_url).then(function (response) {
            rows = response.data.rows;
            app.vue.current_user_id = response.data.current_user_id;
            app.enumerate(rows);
            app.vue.rows=rows;
            app.vue.current_user_email = response.data.current_user_email;
        })
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
