import Vue from "vue";
import EventService from "@/services/EventService.js";
Vue.config.productionTip = false;

Vue.component("Search", {
  props: {
    fields: {
      type: Object
    }
  },
  render() {
    return (
      <div class="container">
        <div class="search-container">
          <input
            type="text"
            placeholder="Search..."
            class="search-bar"
            id="searchBar"
            readonly
            onClick={() => this.openForm("myForm")}
          />
          <button class="close-button" onClick={this.closeAllForm}>
            X
          </button>
        </div>
        <div class="form-popup" id="myForm">
          <div class="form-container">
            <button class="btn">Sites</button>
            <button class="btn">Pages</button>
            <button
              class="btn"
              onClick={() => this.closeForm("myForm", "advanceForm")}
            >
              Advance Search
            </button>
          </div>
        </div>
        <div class="form-popup" id="advanceForm">
          <div class="form-container">
            {this.Types()}
            {this.Owners()}
            {this.SpecificName()}
            {this.Status()}
            {this.Dates()}
            {this.SelectDate()}
            {this.SearchTerm()}
            <button class="btn-search">Search</button>
          </div>
        </div>
      </div>
    );
  },
  methods: {
    Types() {
      try {
        let options = this.fields.Advance.map(type => {
          return <option>{type}</option>;
        });
        return (
          <div>
            <label>Type</label>
            <select>{options}</select>
          </div>
        );
      } catch {
        return;
      }
    },
    Owners() {
      try {
        let options = this.fields.Owners.map(type => {
          return <option>{type}</option>;
        });
        return (
          <div>
            <label>Own</label>
            <select>{options}</select>
          </div>
        );
      } catch {
        return;
      }
    },
    SpecificName() {
      return (
        <div>
          <input type="text" class="input-box" id="SpecificPerson" />
        </div>
      );
    },
    Status() {
      try {
        let fieldName = this.fields.Status.map(type => {
          return (
            <span class={type}>
              <input type="checkbox" id={type} />
              <span>{type}</span>
            </span>
          );
        });
        return <div>{fieldName}</div>;
      } catch {
        return;
      }
    },
    Dates() {
      try {
        let options = this.fields.Date.map(type => {
          return <option>{type}</option>;
        });
        return (
          <div>
            <label>Date</label>
            <select>{options}</select>
          </div>
        );
      } catch {
        return;
      }
    },
    SelectDate() {
      return (
        <div>
          <input type="date" class="date-range" />
          <input type="date" class="date-range" />
        </div>
      );
    },
    SearchTerm() {
      return (
        <div>
          <label>Term</label>
          <input type="text" id="search-term" />
        </div>
      );
    },
    openForm(openid, closeid = "") {
      try {
        if (openid) {
          document.getElementById(openid).style.display = "block";
        }
      } catch {
        console.log("Cannot Open", openid);
      }
      try {
        if (closeid) {
          document.getElementById(closeid).style.display = "none";
        }
      } catch {
        console.log("Cannot close", closeid);
      }
    },
    closeForm(closeid, openid = "") {
      try {
        if (closeid) {
          document.getElementById(closeid).style.display = "none";
        }
      } catch {
        console.log("Cannot close", closeid);
      }
      try {
        if (openid) {
          document.getElementById(openid).style.display = "block";
        }
      } catch {
        console.log("Cannot Open", openid);
      }
    },
    closeAllForm() {
      this.closeForm("myForm");
      this.closeForm("advanceForm");
    }
  }
});

Vue.component("List", {
  render() {
    let main_Title = this.titles.map(function(title) {
      return (
        <td>
          <b>{title}</b>
        </td>
      );
    });

    return (
      <table border="1">
        <tr>{main_Title}</tr>
        {this.renderTableData}
      </table>
    );
  },
  data() {
    return {
      titles: ["Title", "Type", "Owner", "Date", "Star", "Trash"],
      showList: this.items,
      startDate: "",
      endDate: "",
      isNotme: ""
    };
  },
  props: {
    items: {
      type: Array
    }
  },
  watch: {
    items() {
      this.showList = this.items;
    }
  },
  computed: {
    renderTableData() {
      return this.showList.map(item => {
        let rowData = Object.values(item).map(values => {
          return <td>{values}</td>;
        });
        return <tr>{rowData}</tr>;
      });
    }
  }
});

new Vue({
  el: "#app",
  data: {
    items: [],
    fields: {}
  },
  created() {
    EventService.getItems()
      .then(respone => {
        this.items = respone.data;
      })
      .catch(error => {
        console.log(error.response);
      });

    EventService.getFields()
      .then(respone => {
        this.fields = respone.data;
      })
      .catch(error => {
        console.log(error.response);
      });
  },
  render() {
    return (
      <div id="#app">
        <Search propsFields={this.fields} />
        <List propsItems={this.items} />
      </div>
    );
  }
});

// new Vue({
//   render: h => h(App)
// }).$mount("#app");
