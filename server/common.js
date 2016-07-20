/**
 * GE Digital Charity Challenge Tracker
 */

'use strict';

const strava = require('strava-v3');
const promiseWhile = require('./lib/promise-while');

/**
 * Get club athletes
 * @returns {Promise}
 */
module.exports.getAthletes = function getAthletes(clubId, accessToken) {
  const _getAthletes = (page) => {
    return new Promise((resolve, reject) => {
      strava.clubs.listMembers({
        id: clubId,
        access_token: accessToken,
        per_page: 200,
        page
      }, (e, d) => {
        if (e) reject(e);
        resolve(d);
      });
    });
  };

  let res = [], d = true, p = 0;

  return new Promise((resolve, reject) => {
    promiseWhile(
      () => d === true || d.length,
      () => {
        return _getAthletes(++p).then((r) => {
          d = r;
          d.forEach(e => res.push(e))
        })
      }
    ).then(() => resolve(res), reject)
  });
}

/**
 * Get athlete
 * @param {number|string} athleteId
 * @param {string} accessToken
 * @returns {Promise}
 */
module.exports.getAthlete = function (athleteId, accessToken) {
  return new Promise((resolve, reject) => {
    strava.athletes.get({
      id: athleteId,
      access_token: accessToken
    }, (e, d) => {
      if (e) reject(e);
      resolve(d);
    });
  });
}

/**
 * Get athlete stats
 * @param {number|string} athleteId
 * @param {string} accessToken
 * @returns {Promise}
 */
module.exports.getAthleteStats = function (athleteId, accessToken) {
  return new Promise((resolve, reject) => {
    strava.athlete.listActivities({
      id: athleteId,
      access_token: accessToken
    }, (e, d) => {
      if (e) reject(e);
      resolve(d);
    });
  });
}