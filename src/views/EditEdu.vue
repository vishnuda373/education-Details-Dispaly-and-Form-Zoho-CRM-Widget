<template>
  <section>
    <form class="form" @submit.prevent="updateEdu">
      <b-field label="Qualification" horizontal>
        <b-select v-model.trim="getEduItem.Name" placeholder="Select a Qualification" disabled>
          <option
              v-for="option in qualifications"
              :value="option"
              :key="option">
              {{ option }}
          </option>
        </b-select>
      </b-field>
      <b-field label="Major in 12th" horizontal v-if="getEduItem.Name == 'Plus Two'">
        <b-select v-model.trim="getEduItem.Major_in_12th">
          <option 
            v-for="option in twelth_majors"
            :value="option"
            :key="option">
            {{ option }}
          </option>
        </b-select>
      </b-field>
      <b-field label="Year of Completion" horizontal>
        <b-select v-model.trim="getEduItem.Year_of_Completion" placeholder="Select a Year">
            <option
                v-for="option in options_for_year_of_completion"
                :value="option"
                :key="option">
                {{ option }}
            </option>
        </b-select>
      </b-field>
      <b-field horizontal v-if="getEduItem.Name == 'Plus Two'">
        <b-switch :value="getEduItem.Year_after_Plus_Two"
        type="is-danger" v-model="getEduItem.Year_after_Plus_Two" disabled>
            Gap More than 2 Years
        </b-switch>
      </b-field>
      <b-field horizontal v-if="getEduItem.Name != '' && getEduItem.Name != 'Plus Two' && getEduItem.Name != 'SSLC'">
        <b-switch :value="getEduItem.Year_After_Degree" v-model="getEduItem.Year_After_Degree" 
        type="is-danger" disabled>
            Gap More than 5 Years
        </b-switch>
      </b-field>
      <template v-if="getEduItem.Name == 'SSLC' || getEduItem.Name == 'Plus Two'">
        <b-field label="Board" horizontal>
          <b-select v-model="getEduItem.Board">
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
                v-model="getEduItem.Institution"
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
      <b-field label="State of Institution" horizontal>
        <b-select v-model="getEduItem.State_of_University" placeholder="State">
            <option
                v-for="option in india_states"
                :value="option"
                :key="option">
                {{ option }}
            </option>
        </b-select>
      </b-field>
      <b-field label="Overall (%)" horizontal>
          <b-input v-model.number="getEduItem.Overall_Score"></b-input>
      </b-field>
      <template v-if="getEduItem.Name == 'Plus Two'">
        <div v-if="getEduItem.Major_in_12th == 'PCB' || getEduItem.Major_in_12th == 'PCMB' "class="columns">
            <div v-if="getEduItem.Major_in_12th == 'PCMB'" class="column">
                <b-field label="Maths (%)">
                      <b-input v-model.number="getEduItem.Maths_Score"></b-input>
                  </b-field>
            </div>
            <div class="column">
                <b-field label="Physics (%)">
                      <b-input v-model.number="getEduItem.Physics_Score"></b-input>
                  </b-field>
            </div>
            <div class="column">
                <b-field label="Chemistry (%)">
                      <b-input v-model.number="getEduItem.Chemistry_Score"></b-input>
                  </b-field>
            </div>
            <div class="column">
                <b-field label="Biology (%)">
                      <b-input v-model.number="getEduItem.Biology_Score"></b-input>
                  </b-field>
            </div>
          </div>
      </template>
      <template v-if="getEduItem.Name != '' && getEduItem.Name != 'Plus Two' && getEduItem.Name != 'SSLC'">
        <b-field label="Stream" horizontal>
          <b-input placeholder="Computer Science" v-model="getEduItem.Stream"></b-input>
        </b-field>
        <b-field label="Number of Backlogs" horizontal>
          <b-numberinput controls-alignment="right" controls-position="compact" min="0" v-model.number="getEduItem.Number_of_Backlogs"></b-numberinput>
        </b-field>
        <b-field label="Number of Subjects Below 50%" horizontal>
          <b-numberinput controls-alignment="right" controls-position="compact" min="0" v-model.number="getEduItem.Number_of_Subjects_Below_50"></b-numberinput>
        </b-field>
        <b-field label="List ofBacklogs" horizontal>
          <b-input placeholder="Comma separated list" v-model="getEduItem.Backlogs"></b-input>
        </b-field>
        <b-field horizontal>
          <b-switch :value="getEduItem.Related_to_Experience" v-model="getEduItem.Related_to_Experience"
          type="is-info">
              Related to Experience
          </b-switch>
        </b-field>
        <b-field horizontal>
          <b-switch :value="getEduItem.Related_to_Other_Qualification" v-model="getEduItem.Related_to_Other_Qualification"
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
export default {
  name: "EditEdu",
  data(){
    return {
      isFetching: false,
      isLoading: false,
      qualifications: [],
      Institution: '',
      options_for_year_of_completion: [],
      list_of_institutions: [],twelth_majors: [
        "PCMB",
        "PCB",
        "Commerce",
        "Humanities",
      ],
      school_boards: [
      "CBSE", "ICSE", "Cambridge", "Kerala", "Other State Boards", "Open School"
      ],
      india_states: [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jammu and Kashmir",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttarakhand",
        "Uttar Pradesh",
        "West Bengal",
        "Andaman and Nicobar Islands",
        "Chandigarh",
        "Dadra and Nagar Haveli",
        "Daman and Diu",
        "Delhi",
        "Lakshadweep",
        "Puducherry",
      ],
    }
  },
  computed: {
    ...mapGetters(["getEntity", "getRecord", "getEduItem"]),
    filteredInstitutions() {
        return uniq(this.list_of_institutions.filter((option) => {
            return option
                .toString()
                .toLowerCase()
                .indexOf(this.Institution.toLowerCase()) >= 0
        }))
    },
  },
  mounted() {
    this.setType();
    this.getListofQualifications();
    this.generateYearOfCompletion();
    this.setInstitutions();
  },
  methods: {
    setType() {
      if(this.getEduItem.Name == '' || this.getEduItem.Name == "Plus Two" || this.getEduItem.Name == "SSLC") {
        this.Type = "School";
      } else {
        this.Type = "College";
      }
    },
    updateEdu() {
      console.log(this.getEduItem);
      console.log("Update Record");
      this.isLoading = true;
      let payload = {
          id: this.getEduItem.id,
          Name: this.getEduItem.Name,
          Year_of_Completion: this.getEduItem.Year_of_Completion.toString(),
        Year_after_Plus_Two: this.getEduItem.Year_after_Plus_Two,
        Year_After_Degree: this.getEduItem.Year_After_Degree,
        State_of_University: this.getEduItem.State_of_University,
        Institution: this.getEduItem.Institution,
        Stream: this.getEduItem.Stream,
        Major_in_12th: this.getEduItem.Major_in_12th,
        Physics_Score: this.getEduItem.Physics_Score,
        Chemistry_Score: this.getEduItem.Chemistry_Score,
        Biology_Score: this.getEduItem.Biology_Score,
        Overall_Score: this.getEduItem.Overall_Score,
        Number_of_Backlogs: this.getEduItem.Number_of_Backlogs,
        Number_of_Subjects_Below_50: this.getEduItem.Number_of_Subjects_Below_50,
        Backlogs: this.getEduItem.Backlogs,
        Related_to_Experience: this.getEduItem.Related_to_Experience,
        Related_to_Other_Qualification: this.getEduItem.Related_to_Other_Qualification
      }
      console.log(payload);
      ZOHO.CRM.API.updateRecord({
        Entity: "Education",
        APIData: payload,
      })
      .then((response)=> {
        console.log("Record updated");
        console.log(response);
        this.$store.dispatch("setEducation");
        this.isLoading = false;
        this.$store.commit("SET_MODE", 0);
      })
      .catch((error) => {
        console.log("Updte Failed");
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
    'getEduItem.Year_of_Completion': function(newValue, oldValue) {
      if(this.Type == "College") {
        if(typeof newValue != 'number'){
          this.getEduItem.Year_After_Degree=true;
        } else {
          if(new Date().getFullYear() - 5 >= newValue) {
            this.getEduItem.Year_After_Degree=true;
          } else {
            this.getEduItem.Year_After_Degree=false;
          }
        }
    } 
    else if(this.Type == "School") {
      if(typeof newValue != 'number') {
        this.getEduItem.Year_after_Plus_Two = true;
      } else {
        if(new Date().getFullYear() - 2 >= newValue) {
          this.getEduItem.Year_after_Plus_Two=true;
        } else {
          this.getEduItem.Year_after_Plus_Two=false;
        }
      }
    }
    }
  }
};
</script>
