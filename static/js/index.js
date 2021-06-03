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
        rows: [],
        user_email: user_email,
        userName : username,
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.add_post = function () {
        axios.post(add_post_url,
            {
                text: app.vue.add_text,
                date: app.vue.add_date,
                time: app.vue.add_time,
                location: app.vue.add_location,
                going: 1,
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
                going: 0,
                is_going: false,
                cur_idx: -1
            });
            app.enumerate(app.vue.rows);
            app.reset_form();
            app.set_add_status(false);
        });
    };

    app.is_going = function (row_idx){
        // let x = app.vue.rows[row_idx].going;
        let x = app.vue.rows[row_idx];
        // post=3;
        axios.get(update_going_url, {params: {id: x.id}}).then(function (response) {
            x.going = response.data.going;
        });
    };

    app.show_going = function (status, index){
        app.vue.show_going_status = status;
        app.vue.cur_idx = index;
    };

    app.reset_form = function () {
        app.vue.add_text = "";
        app.vue.add_date = "";
        app.vue.add_time = "";
        app.vue.add_location = "";
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

    app.complete = () => {
        let text = app.data.text
        let date = app.data.date
        let time = app.data.time
        let location = app.data.location
        app.data.showNewPost = false

        data = {
            text : text,
            date : date,
            time : time,
            location : location
        }

    axios.post(add_post_url, data).then(
        (response) => {
            let id = response.data.id

            new_post = {
                name : app.data.userName,
                text : app.data.text,
                date: app.data.date,
                time : app.data.time,
                location : app.data.location,
                user_email : app.data.user_email,
                id : id,
                rating : {
                    rating : -1
                }
            }
            app.data.posts.splice(0, 0, new_post)
            app.data.posts = app.reindex(app.data.posts)
        });
    };

    app.set_add_status = function (new_status) {
        app.vue.add_mode = new_status;
    };

    // This contains all the methods.
    app.methods = {
        // Complete as you see fit.
        add_post: app.add_post,
        set_add_status: app.set_add_status,
        delete_post: app.delete_post,
        is_going: app.is_going,
        show_going: app.show_going
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
            // var post_list = response.data.posts
            // var reverseList = post_list.reverse()
            // app.vue.posts = app.reindex(reverseList);
            app.enumerate(rows);
            //app.complete(rows);
            app.vue.rows=rows;
        }).then(() => {
            for(let post of app.vue.rows){
                // axios.get(get_going_url, {params: {"post_id": post.id}}).then((response) =>{
                //     post.is_going = response.data.going;
                //     post.num_going = response.data.num_going;
                // });
            }
        });
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
