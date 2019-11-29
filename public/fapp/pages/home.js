define(["services/service.home"],function(homeService){
  return {  // Component Data
    root:"#app",
    data: function () {
      // Must return an object
        return {
            zblist:[
                [
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"}
                ],[
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"}
                ]
            ]
        }
    },
    // Component Methods
    methods: {
      openAlert: function () {
        var self = this;
        self.$app.dialog.alert('Hello World');
      },
      onInput: function (e) {
        var self = this;
        self.$setState({
          name: e.target.value,
        });
      },
      onButtonClick: function () {
        var self = this;
        self.$setState({
          clickCounter: self.clickCounter + 1
        });
      },
      loadList: function () {
        var self = this;
        debugger;
        self.$setState({ listLoading: true });
        // Emulate Ajax request
        setTimeout(() => {
          self.$setState({
            listLoading: false,
            zblist: [
                [
                    {title:"title1",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"}
                ],[
                    {title:"title1",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"}
                ],[
                    {title:"title1",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"},
                    {title:"title",value:0,zb:"zb",unit:"xxx"}
                ]
            ]
          });
        }, 2000);
      },
    },
    // Lifecycle Hooks
    beforeCreate() {
      console.log('componentBeforeCreate', this)
    },
    created() {
      console.log('componentCreated', this)
    },
    beforeMount() {
      console.log('componentBeforeMount', this)
    },
    mounted() {
      console.log('componentMounted', this);
    },
    updated() {
      console.log('componentUpdated', this);
    },
    beforeDestroy() {
      console.log('componentBeforeDestroy', this);
    },
    destroyed() {
      console.log('componentDestroyed', this);
    },
    // Page Events
    on: {
      pageMounted: function(e, page) {
        console.log('pageMounted', page);
      },
      pageInit: function(e, page) {
        console.log('pageInit', page);
      },
      pageBeforeIn: function(e, page) {
        console.log('pageBeforeIn', page);
      },
      pageAfterIn: function(e, page) {
        console.log('pageAfterIn', page);
      },
      pageBeforeOut: function(e, page) {
        console.log('pageBeforeOut', page);
      },
      pageAfterOut: function(e, page) {
        console.log('pageAfterOut', page);
      },
      pageBeforeRemove: function(e, page) {
        console.log('pageBeforeRemove', page);
      },
    }
  }
});