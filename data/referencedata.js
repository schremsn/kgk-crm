/**
 * class used to store global reference data
 */
let instance = null;

export default class ReferenceData {
  constructor() {
    if (!instance) {
      instance = this;
    } else {
      return instance;
    }
  }
  states = [];
  activityTypes = [];
  leadTags = new Map();
  userInfo = [];
  companyUnfo = [];

  static getInstance() {
    if (!instance) {
      return new ReferenceData();
    }
    return instance;
  }

  setLeadTags(tags) {
    // convert the array to a map
    if (Array.isArray(tags)) {
      tags.forEach((tag) => {
        this.leadTags.set(tag.id, tag.name);
      });
    }
  }

  getLeadTags() {
    return this.leadTags;
  }

  lookupTagname(id) {
    return this.leadTags.get(id);
  }

  setActivityTypes(types) {
    this.activityTypes = types;
  }

  getActivityTypes() {
    return this.activityTypes;
  }

  setStates(states) {
    this.states = states;
  }

  getStates() {
    return this.states;
  }

  setUserInfo(info) {
    this.userInfo = info;
  }

  getUserInfo() {
    if (Array.isArray(this.userInfo)) {
      return this.userInfo[0];
    }
    
    return this.userInfo;
  }

  getUserLocal() {
    return this.getUserInfo().lang;
  }

  setCompanyInfo(info) {
    this.companyUnfo = info;
  }

  getCompanyInfo() {
    return this.companyInfo;
  }

  /**
   * returns the default company for the user
   */
  getUserCompany() {
    const info = this.getUserInfo();
    if (info !== undefined) {
      return info.company_id[0];
    }

    return null;
  }

  getUserLanguage() {
    const info = this.getUserInfo();
    if (info !== undefined) {
      return info.lang;
    }

    return null;
  }
}

