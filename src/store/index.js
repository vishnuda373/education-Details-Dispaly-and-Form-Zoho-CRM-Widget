import Vue from "vue";
import Vuex from "vuex";
import { ZOHO } from "../assets/ZohoEmbededAppSDK.min.js";

Vue.use(Vuex);

export default new Vuex.Store({
  // strict: true,
  state: {
    entity: {},
    record: {},
    education: [],
    mode: 0,
    edu_item: {},
  },
  getters: {
    getEntity: (state) => {
      return state.entity;
    },
    getRecord: (state) => {
      return state.record;
    },
    getEducation: (state) => {
      return state.education;
    },
    getEduItem: (state) => {
      return state.edu_item;
    },
  },
  mutations: {
    SET_ENTITY(state, payload) {
      state.entity = payload;
    },
    SET_RECORD(state, payload) {
      state.record = payload;
    },
    SET_EDUCATION(state, payload) {
      state.education = payload;
    },
    SET_MODE(state, payload) {
      state.mode = payload;
    },
    SET_EDU_ITEM(state, payload) {
      state.edu_item = payload;
    },
  },
  actions: {
    async setEntity({ commit }) {
      /* Fetch the Module Name (Entity) and record id (EntityId) */
      ZOHO.embeddedApp.on("PageLoad", function(data) {
        commit("SET_ENTITY", data);
      });
    },
    async setRecord({ commit, getters }) {
      /* Fetch all the record fields for the related page */
      let e = getters.getEntity;
      return ZOHO.CRM.API.getRecord({ Entity: e.Entity, RecordID: e.EntityId })
        .then((record) => {
          commit("SET_RECORD", record.data[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async setEducation({ commit, getters }) {
      // Fetch related Education
      let e = getters.getEntity;
      return ZOHO.CRM.API.getRelatedRecords({
        Entity: e.Entity,
        RecordID: e.EntityId,
        RelatedList: "Edu_Records",
        approved: "both",
        sort_by: "Year_of_Completion"
      })
        .then((record) => {
          commit("SET_EDUCATION", record.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
