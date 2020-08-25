import Vue from "vue";
import EventService from "@/services/EventService.js";
Vue.config.productionTip = false;

Vue.component("Search", {
  props: {
    fields: {
      type: Object
    }
  },
  data() {
    return {
      query: {
        type: "",
        owner: "",
        starred: false,
        trash: false,
        term: ""
      },
      startDate: "",
      endDate: "",
      isNotme: false
    };
  },
  render() {
    return this.MainForm();
  },
  computed: {
    queryString() {
      let computedQueryString = "";
      for (let key in this.query) {
        if (this.query[key]) {
          computedQueryString += key + ":" + this.query[key] + " ";
        }
      }
      return computedQueryString;
    },
    outputString() {
      let computedQueryString = "";
      for (let key in this.query) {
        if (this.query[key]) {
          computedQueryString += key + ":" + this.query[key] + "&";
        }
      }
      computedQueryString = computedQueryString.replace("term:", "");
      return computedQueryString;
    },
    conditions() {
      console.log(this.startDate);
      return this.startDate + "&" + this.endDate + "&" + this.isNotme;
    }
  },
  methods: {
    SearchBar() {
      try {
        return (
          <div class="search-container">
            <input
              type="text"
              placeholder="Search..."
              class="search-bar"
              id="searchBar"
              domPropsValue={this.queryString}
              onKeyup={e => this.handleInput(e)}
              onClick={() => this.openForm("myForm")}
            />
            <button class="close-button" onClick={this.closeAllForm}>
              X
            </button>
          </div>
        );
      } catch {
        return;
      }
    },
    handleInput(e) {
      if (e.keyCode === 13) {
        let items = e.target.value.split(" ");
        for (let item of items) {
          if (item.includes(":")) {
            let temp = item.split(":");
            let header = temp[0].toLowerCase();
            if (this.fields.InputFields.includes(header)) {
              this.query[header] = temp[1];
            }
          } else {
            this.query.term = item;
          }
          this.handleSubmit();
        }
      }
    },
    Selectors() {
      try {
        let options = this.fields.Types.map(type => {
          return (
            <button
              class="btn"
              value={type}
              onClick={e => this.Action(e.target.value)}
            >
              {type}
            </button>
          );
        });
        return (
          <div class="form-popup" id="myForm">
            <div class="form-container">{options}</div>
          </div>
        );
      } catch {
        return;
      }
    },
    AdvanceForm() {
      try {
        return (
          <div class="form-popup" id="advanceForm">
            <div class="form-container">
              {this.Types()}
              {this.Owners()}
              {this.SpecificName()}
              {this.Status()}
              {this.Dates()}
              {this.SelectDate()}
              {this.SearchTerm()}
              <button class="btn-search" onClick={this.handleSubmit}>
                Search
              </button>
            </div>
          </div>
        );
      } catch {
        return;
      }
    },
    handleSubmit() {
      if (this.queryString.includes("owner:!")) {
        this.query.owner = "";
        this.isNotme = true;
      }
      this.$emit("submitQuery", this.outputString, this.conditions);
    },
    MainForm() {
      return (
        <div class="container">
          {this.SearchBar()}
          {this.Selectors()}
          {this.AdvanceForm()}
        </div>
      );
    },
    Reset() {
      this.type = "";
      this.query.owner = "";
      this.query.starred = false;
      this.query.trash = false;
      this.query.term = "";
      this.startDate = "";
      this.endDate = "";
      this.isNotme = false;
    },
    Action(type) {
      if (type == "Advanced Search") {
        this.closeForm("myForm", "advanceForm");
      } else {
        this.Reset();
        this.query.type = type;
        this.handleSubmit();
      }
    },
    Types() {
      try {
        let options = this.fields.Advance.map(type => {
          return <option value={type.value}>{type.title}</option>;
        });
        return (
          <div>
            <label>Type</label>
            <select
              domPropsValue={this.query.type}
              onChange={e => (this.query.type = e.target.value)}
            >
              {options}
            </select>
          </div>
        );
      } catch {
        return;
      }
    },
    ChangeOwner(newValue) {
      if (newValue == "Specific Person...") {
        this.query.owner = "";
        document.getElementById("SpecificPerson").style.display = "block";
        return;
      }
      document.getElementById("SpecificPerson").style.display = "none";
      this.query.owner = newValue;
    },
    Owners() {
      try {
        let options = this.fields.Owners.map(owner => {
          return <option value={owner.value}>{owner.title}</option>;
        });
        return (
          <div>
            <label>Own</label>
            <select
              domPropsValue={this.query.owner}
              onChange={e => this.ChangeOwner(e.target.value)}
            >
              {options}
            </select>
          </div>
        );
      } catch {
        return;
      }
    },
    SpecificName() {
      try {
        let options = this.fields.Persons.map(person => {
          return <option value={person.value}>{person.title}</option>;
        });
        return (
          <div id="SpecificPerson">
            <label>Who</label>
            <select
              domPropsValue={this.query.owner}
              onChange={e => this.ChangeOwner(e.target.value)}
            >
              {options}
            </select>
          </div>
        );
      } catch {
        return;
      }
    },
    Status() {
      return (
        <div>
          <span class="Starred">
            <input
              type="checkbox"
              id="Starred"
              domPropsChecked={this.query.starred}
              onChange={e => (this.query.starred = e.target.checked)}
            />
            <span>Starred</span>
          </span>
          <span class="Trash">
            <input
              type="checkbox"
              id="Trash"
              domPropsChecked={this.query.trash}
              onChange={e => (this.query.trash = e.target.checked)}
            />
            <span>Trash</span>
          </span>
        </div>
      );
    },
    Dates() {
      try {
        let options = this.fields.Date.map(type => {
          return <option domPropsValue={type}>{type}</option>;
        });
        return (
          <div>
            <label>Date</label>
            <select onChange={e => this.ChangeDate(e.target.value)}>
              {options}
            </select>
          </div>
        );
      } catch {
        return;
      }
    },
    SelectDate() {
      return (
        <div>
          <input
            type="date"
            class="date-range"
            onChange={e => (this.startDate = e.target.value)}
          />
          <input
            type="date"
            class="date-range"
            onChange={e => (this.endDate = e.target.value)}
          />
        </div>
      );
    },
    CalculateDate(range) {
      return (
        new Date(new Date().setDate(new Date().getDate() - range))
          .toJSON()
          .slice(0, 10)
          .replace(/-/g, "-") + " "
      );
    },
    ChangeDate(value) {
      for (let i of document.getElementsByClassName("date-range")) {
        i.style.display = "none";
      }
      if (value == "Anytime") {
        this.startDate = "";
        this.endDate = "";
      } else {
        let today =
          new Date()
            .toJSON()
            .slice(0, 10)
            .replace(/-/g, "-") + " ";
        this.endDate = today;
        if (value == "Today") {
          this.startDate = today;
        } else if (value == "Yesterday") {
          this.startDate = this.CalculateDate(1);
        } else {
          if (value == "Last 7 days") {
            this.startDate = this.CalculateDate(7);
          } else if (value == "Last 30 days") {
            this.startDate = this.CalculateDate(30);
          } else if (value == "Last 90 days") {
            this.startDate = this.CalculateDate(90);
          } else if (value == "Custom...") {
            for (let i of document.getElementsByClassName("date-range")) {
              i.style.display = "inline-block";
            }
          }
        }
      }
    },
    SearchTerm() {
      return (
        <div>
          <label>Term</label>
          <input
            type="text"
            id="search-term"
            value={this.query.term}
            onKeyup={e => (this.query.term = e.target.value)}
          />
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
    },
    queryString: {
      type: String
    },
    conditions: {
      type: String
    }
  },
  methods: {
    filtering() {
      let filteredList = [];
      for (let item of this.items) {
        let itemQueryString = "";
        Object.entries(item).map(
          ([key, value]) =>
            (itemQueryString +=
              key.toLowerCase() + ":" + value.toLowerCase() + " ")
        );
        let isFalse = false;
        for (let condition of this.queryString.split("&")) {
          if (!itemQueryString.includes(condition)) {
            isFalse = true;
            break;
          }
        }
        if (!isFalse) {
          filteredList.push(item);
        }
      }
      this.showList = filteredList;
      if (this.isNotme == "true") {
        for (let i in this.showList) {
          if (this.showList[i].Owner == "Khanh") {
            delete this.showList[i];
          }
        }
      }

      if (this.startDate != "" && this.endDate !== "") {
        for (let i in this.showList) {
          if (
            this.showList[i].Date < this.startDate ||
            this.showList[i].Date > this.endDate
          ) {
            delete this.showList[i];
          }
        }
      }
    }
  },
  watch: {
    items() {
      this.showList = this.items;
    },
    conditions() {
      let conditions = this.conditions.split("&");
      this.startDate = conditions[0];
      this.endDate = conditions[1];
      this.isNotme = conditions[2];
      this.filtering();
    },
    queryString() {
      this.queryString = this.queryString.toLowerCase();
      this.filtering();
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
    fields: {},
    queryString: "",
    conditions: ""
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
        <Search
          propsFields={this.fields}
          onSubmitQuery={this.handleSubmitRequest}
        />
        <List
          propsItems={this.items}
          propsQueryString={this.queryString}
          propsConditions={this.conditions}
        />
      </div>
    );
  },
  methods: {
    handleSubmitRequest(queryString, condition) {
      this.queryString = queryString;
      this.conditions = condition;
    }
  }
});
