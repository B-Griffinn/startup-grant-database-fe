// Dependencies
import axios from "axios";

// Objects
import {
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  FILTER_GRANTS,
  FILTER_GRANTS_RESET,
  SELECT_GRANT,
  CHANGE_TAB,
  ADD_GRANT_START,
  ADD_GRANT_SUCCESS,
  ADD_GRANT_FAILURE,
  UPDATE_GRANT_START,
  UPDATE_GRANT_SUCCESS,
  UPDATE_GRANT_FAILURE,
  DELETE_GRANT_START,
  DELETE_GRANT_SUCCESS,
  DELETE_GRANT_FAILURE,
  FILTER_SAVE,
  CHECK_ADMIN,
  SET_USER,
  SET_TOKEN_IN_STORE,
  SUBMIT_SUGGESTION_START,
  SUBMIT_SUGGESTION_SUCCESS,
  SUBMIT_SUGGESTION_FAILURE,
  DELETE_SUGGESTION_START,
  DELETE_SUGGESTION_SUCCESS,
  DELETE_SUGGESTION_FAILURE
} from "./types";

// fetch grants for main view

export const fetchApi = () => dispatch => {
  dispatch({ type: FETCH_START });
  axios
    // .get(`https://labs16-grantly.herokuapp.com/api/grants/`)
    .get(`https://grantly-staging.herokuapp.com/api/grants`)

    .then(response => {
      dispatch({ type: FETCH_SUCCESS, payload: response.data });
    })
    .catch(error => {
      dispatch({ type: FETCH_ERROR });
    });
};

// fetch grants for admin

export const adminFetchApi = user => dispatch => {
  console.log("USER:", user);

  dispatch({ type: FETCH_START });
  axios
    .get(`https://grantly-staging.herokuapp.com/api/admin`, {
      headers: { auth0id: user.auth_id, authorization: `Bearer ${user.token}` }
    })

    .then(response => {
      dispatch({ type: FETCH_SUCCESS, payload: response.data });
    })
    .catch(error => {
      dispatch({ type: FETCH_ERROR });
    });
};

export const saveFilters = filters => dispatch => {
  dispatch({ type: FILTER_SAVE, payload: filters });
};
export const filterGrants = filters => dispatch => {
  let numCheck = 0;

  Object.values(filters).map(filter => {
    filter.length !== 0 && numCheck++;
  });
  numCheck === 0
    ? dispatch({ type: FILTER_GRANTS_RESET })
    : dispatch({ type: FILTER_GRANTS, payload: filters });

  //initial thoughts is to have filters be an array  because users will be able to select multiple grant filter
  //Now filters will be an object that contains different arrays
};

// logic for main selecting grant card

export const selectGrant = grant => dispatch => {
  dispatch({ type: SELECT_GRANT, payload: grant });
  dispatch({ type: CHANGE_TAB, payload: 1 });
};

export const changeTab = tab => dispatch => {
  dispatch({ type: CHANGE_TAB, payload: tab });
};

// Submit a Grant
export const postGrants = addGrant => dispatch => {
  dispatch({ type: ADD_GRANT_START });
  axios
    .post("https://grantly-staging.herokuapp.com/api/grants", addGrant)
    // .post("https://labs16-grantly.herokuapp.com/api/grants/", addGrant)

    .then(res => {
      dispatch({ type: ADD_GRANT_SUCCESS, payload: res.data });
    })
    .catch(err => {
      // console.log(err.response);
      dispatch({ type: ADD_GRANT_FAILURE });
    });
};

// Update a Grant
export const putGrants = (updateGrant, user) => dispatch => {
  console.log("Put", updateGrant);
  dispatch({
    type: UPDATE_GRANT_START
  });
  axios
    .put(
      `https://grantly-staging.herokuapp.com/api/admin/${updateGrant.id}`,
      updateGrant,
      {
        headers: {
          auth0id: user.auth_id,
          authorization: `Bearer ${user.token}`
        }
      }
    )

    .then(success => {
      axios
        // .get(`https://labs16-grantly.herokuapp.com/api/grants/`)
        .get(`https://grantly-staging.herokuapp.com/api/admin`, {
          headers: {
            auth0id: user.auth_id,
            authorization: `Bearer ${user.token}`
          }
        })

        .then(response => {
          dispatch({
            type: UPDATE_GRANT_SUCCESS,
            payload: [response.data, updateGrant.id]
          });
        })
        .catch(error => {
          dispatch({ type: UPDATE_GRANT_FAILURE, payload: error });
        });
    })
    .catch(err => {
      dispatch({ type: UPDATE_GRANT_FAILURE, payload: err });
    });
};

// Delete A grant

export const deleteGrants = (id, user) => dispatch => {
  dispatch({
    type: DELETE_GRANT_START
  });
  axios
    .delete(`https://grantly-staging.herokuapp.com/api/admin/${id}`, {
      headers: {
        auth0id: user.auth_id,
        authorization: `Bearer ${user.token}`
      }
    })

    .then(res => {
      axios
        // .get(`https://labs16-grantly.herokuapp.com/api/grants/`)
        .get(`https://grantly-staging.herokuapp.com/api/admin`, {
          headers: {
            auth0id: user.auth_id,
            authorization: `Bearer ${user.token}`
          }
        })

        .then(response => {
          dispatch({
            type: DELETE_GRANT_SUCCESS,
            payload: response.data
          });
        })
        .catch(error => {
          dispatch({ type: DELETE_GRANT_FAILURE, payload: error });
        });
    })
    .catch(err => {
      dispatch({ type: DELETE_GRANT_FAILURE, payload: err });
    });
};

//Check if user is admin
export const checkUser = user => dispatch => {
  dispatch({ type: CHECK_ADMIN });
  const auth = { ...user, auth_id: user.sub };

  axios

    .get("https://grantly-staging.herokuapp.com/user", {
      headers: {
        auth_id: auth.auth_id
      }
    })
    .then(res => {
      dispatch({ type: SET_USER, payload: res.data });
      dispatch({ type: SET_TOKEN_IN_STORE, payload: user.token });
    })
    .catch(err => {
      const newUser = { role: "user", auth_id: auth.auth_id };
      if (err.response.status === 404) {
        axios

          .post("https://grantly-staging.herokuapp.com/user", newUser)
          .then(res => {
            dispatch({ type: SET_USER, payload: res.data });
          })
          .catch(err => {});
      }
    });
};

// logic for suggestion modal

export const submitSuggestion = suggestion => dispatch => {
  dispatch({ type: SUBMIT_SUGGESTION_START });
  axios
    .post(
      "https://grantly-staging.herokuapp.com/api/grants/suggestion",
      suggestion
    )

    .then(response => {
      console.log("Success");
      dispatch({ type: SUBMIT_SUGGESTION_SUCCESS, payload: response.data });
    })
    .catch(error => {
      console.log("submitSuggestion error", error);
      dispatch({ type: SUBMIT_SUGGESTION_FAILURE });
    });
};

// Delete a grant suggestion, must be an admin
export const deleteSuggestion = (requestId, user) => dispatch => {
  dispatch({ type: DELETE_SUGGESTION_START });
  axios
    .delete(
      `https://grantly-staging.herokuapp.com/api/admin/suggestion/${requestId}`,
      {
        headers: {
          auth0id: user.auth_id,
          authorization: `Bearer ${user.token}`
        }
      }
    )

    .then(response => {
      dispatch({ type: DELETE_SUGGESTION_SUCCESS, payload: response.data });
    })
    .catch(error => {
      dispatch({ type: DELETE_SUGGESTION_FAILURE });
    });
};
