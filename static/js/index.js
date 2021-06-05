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
        add_tag1: "",
        add_tag2: "",
        add_tag3: "",
        rows: [],
        user_email: user_email,
        userName : username,
        add_going: 0,
        going_list: [],
        num_going: 0,
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
                tag1: app.vue.add_tag1,
                tag2: app.vue.add_tag2,
                tag3: app.vue.add_tag3,
                going: app.vue.add_going,
                is_going: false,
                cur_idx: -1,
                going_list: [],
            });
            app.enumerate(app.vue.rows);
            app.reset_form();
            app.set_add_status(false);
        });
    };

    app.add_tags = function () {
        console.log("add_tags called")
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
            // app.reset_form();
            // app.set_add_status(false);
        });
    };

    app.add_post_tag = function () {
        console.log("add_post_tag working")
        app.add_tags()
        app.add_post()
    };

    app.is_going = function (row_idx){ // this runs when you click the going button
        // let x = app.vue.rows[row_idx].going;
        let x = app.vue.rows[row_idx];
        app.enumerate(app.vue.rows);
        // window.location.reload() // EMERGENCY ONLY
        // document.location.reload()
        location.reload(true);
        // object.reload(forcedReload);
        // history.go(0);
        // setTimeout(location.reload)

          

        // post=3;
        axios.get(update_going_url, {params: {id: x.id}}).then(function (response) {
            x.going = response.data.going;
            
            // x.going_list.append("asdf")
        });
    };

    app.is_not_going = function (row_idx){ // this runs when you click the going button
        // let x = app.vue.rows[row_idx].going;
        let x = app.vue.rows[row_idx];
        app.enumerate(app.vue.rows);
        // window.location.reload() // EMERGENCY ONLY
        // document.location.reload()
        location.reload(true); // works 90%???
        // object.reload(forcedReload);
        // history.go(0);
        // setTimeout(location.reload)

          

        // post=3;
        axios.get(update_not_going_url, {params: {id: x.id}}).then(function (response) {
            x.going = response.data.going;
            
            // x.going_list.append("asdf")
        });
    };

    app.show_button = function (row_idx){
        // let x = app.vue.rows[row_idx];
        // let y = x.going_list;
        // let e = user_email;
        // console.log(y[0]);
        // console.log(y.length);
        // for(let i=0;i<y.length;i++)
        // {
        //     if(y[i]!=null)
        //     {
        //         if(y[i]==(e))
        //         {
        //             console.log("true");
        //             return true;
        //         }
        //     }
            
        // }
        return false;
    }

    app.show_going = function (status, index){
        app.vue.show_going_status = status;
        app.vue.cur_idx = index;
    };

    app.reset_form = function () {
        app.vue.add_text = "";
        app.vue.add_date = "";
        app.vue.add_time = "";
        app.vue.add_location = "";
        app.vue.add_tag1 = "";
        app.vue.add_tag2 = "";
        app.vue.add_tag3 = "";
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

    

    // app.delete_tags = function (row_idx) {
    //     print("delete_tags working")
    //     let id = app.vue.rows[row_idx].id;
    //     axios.get(delete_tags_url, {params: {id: id}}).then(function (response) {
    //         for (let i = 0; i < app.vue.rows.length; i++) {
    //             if (app.vue.rows[i].id === id) {
    //                 app.vue.rows.splice(i, 1);
    //                 app.enumerate(app.vue.rows);
    //                 break;
    //             }
    //         }
    //         });
    // };

    // app.delete_post_tag = function (row_idx) {
    //     print("delete_post_tag working")
    //     app.delete_post(row_idx)
    //     app.delete_tags(row_idx)
    // };

    app.complete = () => {
        let text = app.data.text
        let date = app.data.date
        let time = app.data.time
        let location = app.data.location
        let tag1 = app.data.tag1
        let tag2 = app.data.tag2 
        let tag3 = app.data.tag3
        app.data.showNewPost = false

        data = {
            text : text,
            date : date,
            time : time,
            location : location,
            tag1 : tag1,
            tag2 : tag2,
            tag3 : tag3
        }

    axios.post(add_post_url, data).then(
        (response) => {
            let id = response.data.id

            new_post = {
                name : app.data.userName,
                text : app.data.text,
                date : app.data.date,
                time : app.data.time,
                location : app.data.location,
                tag1 : app.data.tag1,
                tag2 : app.data.tag2,
                tag3 : app.data.tag3,
                user_email : app.data.user_email,
                id : id,
                going: app.data.going,
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

    app.upload_file = function (event, row_idx) {
        console.log("TET")
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
        }
    };

    // This contains all the methods.
    app.methods = {
        // Complete as you see fit.
        add_post: app.add_post,
        add_tags: app.add_tags,
        add_post_tag: app.add_post_tag,
        // delete_tags: app.delete_tags,
        // delete_post_tag: app.delete_post_tag,
        set_add_status: app.set_add_status,
        delete_post: app.delete_post,
        is_going: app.is_going,
        show_going: app.show_going,
        show_button: app.show_button,
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
            app.vue.num_going = response.data.num_going;
            app.enumerate(rows);
            //app.complete(rows);
            app.vue.rows=rows;
        }).then(() => {
            // for(let post of app.vue.rows){
            //     // axios.get(get_going_url, {params: {"post_id": post.id}}).then((response) =>{
            //     //     post.is_going = response.data.going;
            //     //     post.num_going = response.data.num_going;
            //     // });
            // }
        });
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
