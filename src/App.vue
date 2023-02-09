<template>
  <div class="container mt-2">
    <template v-if="$store.state.mode == 0">
      <b-button class="button is-primary" @click="$store.commit('SET_MODE', 1)"> Add New</b-button>
      <b-table
        :data="getEducation"
        :columns="columns"
        :hoverable="true"
        :selected.sync="selected"
        @click="viewEdu=true"
      ></b-table>
      <b-modal v-model="viewEdu" full-screen>
        <b-button v-if="this.selected.$editable" class="button is-primary" @click="$store.commit('SET_MODE', 2);viewEdu=false" > Edit </b-button>
        <form class="form">
          <fieldset disabled>
            <b-field label="Qualification" horizontal>
              <b-input v-model="selected.Name"></b-input>
            </b-field>
            <b-field label="Major in 12th" horizontal v-if="selected.Name == 'Plus Two'">
              <b-input v-model="selected.Major_in_12th"></b-input>
            </b-field>
            <b-field label="Year of Completion" horizontal>
              <b-input v-model="selected.Year_of_Completion"></b-input>
            </b-field>
            <b-field label="Gap More than 2 Years" horizontal v-if="selected.Gap_2_Year">
              <b-switch v-model="selected.Gap_2_Year"></b-switch>
            </b-field>
            <b-field horizontal v-if="selected.Gap_5_Year">
              <b-switch v-model="selected.Gap_5_Year"></b-switch>
            </b-field>
            <b-field label="Board" horizontal v-if="selected.Board">
              <b-input v-model="selected.Board"></b-input>
            </b-field>
            <b-field label="Institution" horizontal>
              <b-input v-model="selected.Institution"></b-input>
            </b-field>
            <b-field label="State of Institution" horizontal>
              <b-input v-model="selected.State_of_University"></b-input>
            </b-field>
            <b-field label="Overall (%)" horizontal>
              <b-input v-model.number="selected.Overall_Score"></b-input>
            </b-field>
            <template v-if="selected.Name == 'Plus Two'">
              <div v-if="selected.Major_in_12th == 'PCB' || selected.Major_in_12th == 'PCMB' "class="columns">
                  <div v-if="selected.Major_in_12th == 'PCMB'" class="column">
                      <b-field label="Maths (%)">
                            <b-input v-model.number="selected.Maths_Score"></b-input>
                        </b-field>
                  </div>
                  <div class="column">
                      <b-field label="Physics (%)">
                            <b-input v-model.number="selected.Physics_Score"></b-input>
                        </b-field>
                  </div>
                  <div class="column">
                      <b-field label="Chemistry (%)">
                            <b-input v-model.number="selected.Chemistry_Score"></b-input>
                        </b-field>
                  </div>
                  <div class="column">
                      <b-field label="Biology (%)">
                            <b-input v-model.number="selected.Biology_Score"></b-input>
                        </b-field>
                  </div>
                </div>
            </template>
            <template v-if="selected.Name != '' && selected.Name != 'Plus Two' && selected.Name != 'SSLC'">
              <b-field label="Stream" horizontal>
                <b-input v-model="selected.Stream"></b-input>
              </b-field>
              <b-field label="Number of Backlogs" horizontal>
                <b-input v-model="selected.Number_of_Backlogs"></b-input>
              </b-field>
              <b-field label="Number of Subjects Below 50%" horizontal>
                <b-input v-model="selected.Number_of_Subjects_Below_50"></b-input>
              </b-field>
              <b-field label="List of Backlogs" horizontal>
                <b-input v-model="selected.Backlogs"></b-input>
              </b-field>
             <b-field horizontal v-if="!selected.Related_to_Experience">
              <b-switch v-model="selected.Related_to_Experience">Related to Experience</b-switch>
            </b-field>
            <b-field horizontal v-if="!selected.Related_to_Other_Qualification">
              <b-switch v-model="selected.Related_to_Other_Qualification">Related to Other Education</b-switch>
            </b-field>
            </template>
          </fieldset>
        </form>
      </b-modal>
    </template>
    <template v-if="$store.state.mode == 1">
      <CreateEdu />
    </template>
    <template v-if="$store.state.mode == 2">
      <EditEdu />
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import CreateEdu from "@/views/CreateEdu.vue";
import EditEdu from "@/views/EditEdu.vue";

export default {
  name: "App",
  components: {
    CreateEdu,
    EditEdu
  },
  data() {
    return {
      selected: {},
      viewEdu: false,
      columns: [
        { field: "Name", label: "Qualification" },
        { field: "Institution", label: "Institution" },
        { field: "Year_of_Completion", label: "Year of Completion" },
        { field: "State_of_University", label: "State" },
      ],
    };
  },
  computed: {
    ...mapGetters(["getEntity", "getRecord", "getEducation", "getEduItem"]),
  },
  watch: {
    getEntity() {
      this.$store.dispatch("setRecord");
    },
    getRecord() {
      this.$store.dispatch("setEducation");
    },
    selected() {
      this.$store.commit("SET_EDU_ITEM", this.selected);
    }
  },
  methods: {
    ...mapActions(["setRecord", "setEducation"]),
  },
};
</script>

<style></style>
