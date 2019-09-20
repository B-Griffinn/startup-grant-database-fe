import React from "react";
import GrantList from "../components/grants/GrantList";
import Filters from "../components/Filters";
import GrantShowcase from "../components/grants/GrantShowcase";
import Grid from "@material-ui/core/Grid";
import Navbar from "../components/Navbar";
import Media from "react-media";

const Home = props => {
  return (
    <>
      <Navbar />
      <Media query="(max-width:850px)">
        {matches =>
          matches ? null : (
            <div>
              <Grid container spacing={2} className="grid-container">
                <Grid item md={4} xs={12} className="grid-item">
                  <GrantList />
                </Grid>
                <Grid item xs={6}>
                  <GrantShowcase />
                </Grid>
                <Grid item xs={2}>
                  <Filters location={props.location.pathname} />
                </Grid>
              </Grid>
            </div>
          )
        }
      </Media>
    </>
  );
};

export default Home;
