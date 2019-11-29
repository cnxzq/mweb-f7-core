
requirejs(["framework7"],function(Framework7){
	var app = new Framework7({
    
    root: '#app',// App root element
    
    name: 'Demo',// App Name
    
    id: 'com.kykjsoft.test',// App id
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    on: {
        pageBeforeIn: function (event, page) {
          // do something before page gets into the view
          //alert(11);
        },
        pageAfterIn: function (event, page) {
          // do something after page gets into the view
        },
        pageInit: function (event, page) {
        	window.showPage && window.showPage();
        },
        pageBeforeRemove: function (event, page) {
          // do something before page gets removed from DOM
        },
    },
    // Add default routes
    routes: [
      {
        path: '/about/',
        url: 'pages/about.html'
      },
      {
        path:'/tabs/',
        componentUrl:"pages/tabs-swipeable.html",
        options: {
          context: {
            foo: 'bar',
          },
        },
      },
      {
        path:'/template/',
        templateUrl:"pages/parser_template.html",
        options: {
          context: {
            foo: 'bar',
          },
        },
        on: {
          pageBeforeIn: function (event, page) {
            // do something before page gets into the view
            alert(11);
          },
          pageAfterIn: function (event, page) {
            // do something after page gets into the view
          },
          pageInit: function (event, page) {
            // do something when page initialized
          },
          pageBeforeRemove: function (event, page) {
            // do something before page gets removed from DOM
          },
        },
      },
      {
        path: '/somepage/',
        // Component Object
        component: {
          template: `
            <div class="page">
              <div class="navbar">
                <div class="navbar-inner">
                  <div class="title">{{title}}</div>
                </div>
              </div>
              <div class="page-content">
                <a @click="openAlert" class="red-link">Open Alert</a>
                <div class="list simple-list">
                  <ul>
                    {{#each names}}
                      <li>{{this}}</li>
                    {{/each}}
                  </ul>
                </div>
              </div>
            </div>
          `,
          style: `
            .red-link {
              color: red;
            }
          `,
          data: function () {
            return {
              title: 'Component Page',
              names: ['John', 'Vladimir', 'Timo'],
            }
          },
          methods: {
            openAlert: function () {
              var self = this;
              self.$app.dialog.alert('Hello world!');
            },
          },
          on: {
            pageInit: function (e, page) {
              // do something on page init
            },
            pageAfterOut: function (e, page) {
              // page has left the view
            },
          }
        },
    },
    // Async
    {
        path: '/async/',
        async: function (routeTo, routeFrom, resolve, reject) {
            // Requested route
            console.log(routeTo);
            // Get external data and return template7 template
            this.app.request.json('test.json', function (data) {
                resolve(
                // How and what to load: template
                {
                    template: '<div class="page">{{users.name}}</div>'
                },
                // Custom template context
                {
                    context: {
                        users: data,
                    },
                }
                );
            });
        }
    }
    ],
    // ... other parameters
  });
  
  var mainView = app.views.create('.view-main');
});