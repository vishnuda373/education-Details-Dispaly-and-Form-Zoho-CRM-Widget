<template>
  <section>
    <form class="form" @submit.prevent="insertEdu">
      <b-field label="Qualification" horizontal>
        <b-select v-model.trim="Name" placeholder="Select a Qualification">
          <option
              v-for="option in qualifications"
              :value="option"
              :key="option">
              {{ option }}
          </option>
        </b-select>
      </b-field>
      <b-field label="Major in 12th" horizontal v-if="Name == 'Plus Two'">
        <b-select v-model.trim="Major_in_12th">
          <option 
            v-for="option in twelth_majors"
            :value="option"
            :key="option">
            {{ option }}
          </option>
        </b-select>
      </b-field>
      <b-field label="Year of Completion" horizontal>
        <b-select v-model.trim="Year_of_Completion" placeholder="Select a Year">
            <option
                v-for="option in options_for_year_of_completion"
                :value="option"
                :key="option">
                {{ option }}
            </option>
        </b-select>
      </b-field>
      <b-field horizontal v-if="Name == 'Plus Two'">
        <b-switch :value="Year_after_Plus_Two"
        type="is-danger" v-model="Year_after_Plus_Two" disabled>
            Gap More than 2 Years
        </b-switch>
      </b-field>
      <b-field horizontal v-if="Type == 'College'">
        <b-switch :value="Year_After_Degree" v-model="Year_After_Degree" 
        type="is-danger" disabled>
            Gap More than 5 Years
        </b-switch>
      </b-field>
      <template v-if="Type !== 'College'">
        <b-field label="Board" horizontal>
          <b-select v-model="Board">
            <option 
              v-for="option in school_boards"
              :value="option"
              :key="option">
              {{ option }}
            </option>
          </b-select>
        </b-field>
      </template>
      <b-field label="Institution" horizontal>
            <b-autocomplete
                v-model="Institution"
                :data="filteredInstitutions"
                placeholder="e.g. IIT Chennai"
                icon="magnify"
                :open-on-focus=true
                :loading="isFetching"
                clearable
                @typing="getInstitutions"
                @select="option => selected = option">
                <template #empty>No results found. Please raise a request to admin</template>
            </b-autocomplete>
        </b-field>
        <div class="columns">
            <div class="column is-one-quarter">
                <b-field label="State of Institution">
                  <b-select v-model="State_of_University" placeholder="State">
                      <option
                          v-for="option in india_states"
                          :value="option.state"
                          :key="option.state"
                          >
                          {{ option.state }}
                      </option>
                  </b-select>
                </b-field>
            </div>
            <div class="column is-one-quarter">
                <b-field label="District">
                      <b-select v-model="District" placeholder="District">
                      <option
                          v-for="option in districts"
                          :value="option"
                          :key="option">
                          {{ option }}
                      </option>
                  </b-select>
                </b-field>
            </div>
            <div class="column is-one-quarter">
                <b-field label="City">
                      <b-input v-model.trim="Addresss_Line_2"></b-input>
                  </b-field>
            </div>
            <div class="column is-one-quarter">
                <b-field label="Location">
                      <b-input v-model.trim="Addresss_Line_1"></b-input>
                  </b-field>
            </div>
          </div>
      
      <b-field label="Overall (%)" horizontal>
          <b-input v-model.number="Overall_Score"></b-input>
      </b-field>
      <template v-if="Name == 'Plus Two'">
        <div v-if="Major_in_12th == 'PCB' || Major_in_12th == 'PCMB' "class="columns">
            <div v-if="Major_in_12th == 'PCMB'" class="column">
                <b-field label="Maths (%)">
                      <b-input v-model.number="Maths_Score"></b-input>
                  </b-field>
            </div>
            <div class="column">
                <b-field label="Physics (%)">
                      <b-input v-model.number="Physics_Score"></b-input>
                  </b-field>
            </div>
            <div class="column">
                <b-field label="Chemistry (%)">
                      <b-input v-model.number="Chemistry_Score"></b-input>
                  </b-field>
            </div>
            <div class="column">
                <b-field label="Biology (%)">
                      <b-input v-model.number="Biology_Score"></b-input>
                  </b-field>
            </div>
          </div>
      </template>
      <template v-if="Type == 'College'">
        <b-field label="Stream" horizontal>
            <b-autocomplete
                v-model="Stream"
                :data="filteredCourses"
                field="Course_Name"
                icon="magnify"
                clearable
                >
                <template #empty>No results found.</template>
            </b-autocomplete>
        </b-field>
        <b-field label="Number of Backlogs" horizontal>
          <b-numberinput controls-alignment="right" controls-position="compact" min="0" v-model.number="Number_of_Backlogs"></b-numberinput>
        </b-field>
        <b-field label="Number of Subjects Below 50%" horizontal>
          <b-numberinput controls-alignment="right" controls-position="compact" min="0" v-model.number="Number_of_Subjects_Below_50"></b-numberinput>
        </b-field>
        <b-field v-if="this.Number_of_Backlogs > 0" label="List ofBacklogs" horizontal>
          <b-input placeholder="Comma separated list" v-model="Backlogs"></b-input>
        </b-field>
                 <b-field horizontal>
          <b-switch :value="Related_to_Experience" v-model="Related_to_Experience"
          type="is-info">
              Related to Experience
          </b-switch>
        </b-field>
        <b-field horizontal>
          <b-switch :value="Related_to_Others" v-model="Related_to_Others"
          type="is-info">
              Related to Other Qualifications
          </b-switch>
        </b-field>
      </template>
      <div class="field is-grouped is-pulled-right">
          <div class="control">
            <button class="button is-link">Submit</button>
          </div>
          <div class="control">
            <button
              class="button is-link is-light"
              @click="$store.commit('SET_MODE', 0)"
            >
              Cancel
            </button>
          </div>
        </div>
    </form>
    <b-loading :is-full-page="true" v-model="isLoading" :can-cancel="false"></b-loading>
  </section>
</template>

<script>

import { mapState,mapActions, mapGetters } from 'vuex';

import { ZOHO } from "@/assets/ZohoEmbededAppSDK.min.js";
import { debounce, uniq } from 'lodash'
import { countries, states, courses } from "@/data/data.json";

export default {
  name: "CreateEdu",
  data() {
    return {
      isFetching: false,
      isLoading: false,
      Name: "",
      Year_of_Completion: "",
      Type: "School",
      Year_after_Plus_Two: false,
      Year_After_Degree: false,
      Addresss_Line_1: "",
      Addresss_Line_2 : "",
      State_of_University: "Kerala",
      Institution: "",
      Stream: "",
      Board: "",
      Major_in_12th: "",
      Maths_Score: "",
      Physics_Score: "",
      Chemistry_Score: "",
      Biology_Score: "",
      Overall_Score: "",
      Number_of_Backlogs: 0,
      Number_of_Subjects_Below_50: 0,
      Backlogs: "",
      Related_to_Experience: true,
      Related_to_Others: true,
      list_of_institutions: [],
      options_for_year_of_completion: [],
      qualifications: [],
      twelth_majors: [
        "PCMB",
        "PCB",
        "Commerce",
        "Humanities",
      ],
      school_boards: [
      "CBSE", "ICSE", "Cambridge", "Kerala", "Other State Boards", "Open School"
      ],
      india_states: states,
      districts: [],
      courses: courses,
    };
  },
 computed: {
    ...mapGetters(["getEntity", "getRecord"]),
    filteredInstitutions() {
        return uniq(this.list_of_institutions.filter((option) => {
            return option
                .toString()
                .toLowerCase()
                .indexOf(this.Institution.toLowerCase()) >= 0
        }))
    },
    filteredCourses() {
      return uniq(this.courses.filter((option) => {
        return option.Type == this.Name && option.Course_Name.toString().toLowerCase().indexOf(this.Stream.toLowerCase()) >= 0
      }))
    },
    District() {
       this.india_states.filter((item) => {
        if(item.state == this.State_of_University) {
          this.districts = item.districts;
        }
      });
    }
  },
  mounted() {
    this.setType();
    this.getListofQualifications();
    this.generateYearOfCompletion();
    this.setInstitutions();
  },
  methods: {
    setType() {
      if(this.Name == '' || this.Name == "Plus Two" || this.Name == "SSLC") {
        this.Type = "School";
      } else {
        this.Type = "College";
      }
      console.log(this.Type);
    },
    insertEdu() {
      console.log("Push record");
      this.isLoading = true;
      let payload = {
        Lead: this.getRecord.id,
        Name: this.Name,
        Year_of_Completion: this.Year_of_Completion.toString(),
        Year_after_Plus_Two: this.Year_after_Plus_Two,
        Year_After_Degree: this.Year_After_Degree,
        State_of_University: this.State_of_University,
        Institution: this.Institution,
        Stream: this.Stream,
        Major_in_12th: this.Major_in_12th,
        Physics_Score: this.Physics_Score,
        Chemistry_Score: this.Chemistry_Score,
        Biology_Score: this.Biology_Score,
        Overall_Score: this.Overall_Score,
        Number_of_Backlogs: this.Number_of_Backlogs,
        Number_of_Subjects_Below_50: this.Number_of_Subjects_Below_50,
        Backlogs: this.Backlogs,
        Related_to_Experience: this.Related_to_Experience,
        Related_to_Other_Qualification: this.Related_to_Other_Qualification
      }
      console.log(payload);
      ZOHO.CRM.API.insertRecord({
        Entity: "Education",
        APIData: payload,
      })
        .then((response) => {
          console.log("Record Created");
          console.log(response);
          this.$store.dispatch("setEducation");
          this.isLoading = false;
          this.$store.commit("SET_MODE", 0);
        })
        .catch((error) => {
          console.log("Failed");
          console.log(error);
        })
    },
    async getListofQualifications() {
      ZOHO.CRM.API.getAllRecords({ Entity: "Credential_Documents"})
        .then((response) => {
          response.data.forEach( (item) => {
            this.qualifications.push(item.Name);
          })
        })
        .catch((error) => {
          console.error(error);
        });
    }, 
    generateYearOfCompletion() {
      let today = new Date();
      let current_year = today.getFullYear();
      this.options_for_year_of_completion.push(current_year);
      for (let i = 0; i < 30; i++) {
        current_year -= 1;
        this.options_for_year_of_completion.push(current_year);
      }
    },
    setInstitutions() {
      ZOHO.CRM.API.getAllRecords({ Entity: "Educational_Institutions", sort_order: "desc"})
        .then((response) => {
          response.data.forEach( (item) => {
            this.list_of_institutions.push(item.Name);
          })
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getInstitutions: debounce(function (text) {
      if(!text.length) {
        return
      }
      this.isFetching = true;
      ZOHO.CRM.API.searchRecord({ Entity: "Educational_Institutions", Type:"word",Query:text})
        .then((response) => {
          response.data.forEach( (item) => {
            this.list_of_institutions.push(item.Name);
          })
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.isFetching = false;
        });
    }, 500)
  },
  watch: {
    State_of_University() {
       this.india_states.filter((item) => {
        if(item.state == this.State_of_University) {
          this.districts = item.districts;
        }
      });
    },
   Year_of_Completion() {
    if(this.Type == "College") {
      if(typeof this.Year_of_Completion != 'number'){
        this.Year_After_Degree=true;
      } else {
        if(new Date().getFullYear() - 5 >= this.Year_of_Completion) {
          this.Year_After_Degree=true;
        } else {
          this.Year_After_Degree=false;
        }
      }
    } 
    else if(this.Type == "School") {
      if(typeof this.Year_of_Completion != 'number') {
        this.Year_after_Plus_Two = true;
      } else {
        if(new Date().getFullYear() - 2 >= this.Year_of_Completion) {
          this.Year_after_Plus_Two=true;
        } else {
          this.Year_after_Plus_Two=false;
        }
      }
    }
   },
   Name() {
    this.setType();
   }
  }
};
</script>
