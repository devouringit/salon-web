import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DehazeIcon from '@material-ui/icons/Dehaze';
import GenderModal from "@module/genderModal";
import UserRegistrationModal from "@module/userRegistration";
import { useDispatch, connect } from 'react-redux';
import Link from "next/link";
import { updateStoreData, updateGenderStatus, showSuccess } from "app/redux/actions";
import { prepareStoreData } from "@util/dataFilterService";
import { useSelector } from 'react-redux';
import { windowRef } from "@util/window";
import { useCookies } from "react-cookie";
import UserRegistrationModalAtCart from "@module/userRegistrationAtCart/loginAtCart";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

function MainHeader({ gender, storeData, storeMetaData }) {
  const [cookie, setCookie] = useCookies(["gdr"])
  const [userCookie, setUserCookie] = useState(cookie['user']);
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
  useEffect(() => {
    if (storeData && !storeData.active) {
      console.log('inactiveStore')
    }
  }, [storeData])
  //filter curated group on the basis of gender
  // useEffect(() => {
  //   if (storeData && storeData.storeId && gender) {
  //     // eslint-disable-next-line @typescript-eslint/ban-types
  //     prepareStoreData(storeData, gender).then((response: {}) => {
  //       setTimeout(() => {
  //         dispatch(updateStoreData({ ...response }));
  //       }, 100);
  //     })
  //   }
  // }, [gender])


  const toggleDrawer = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(isOpen ? false : true);
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      onClick={(e) => toggleDrawer(e)}
      onKeyDown={(e) => toggleDrawer(e)}
    >
      <List>
        {["Home"]?.map((text, index) => (
          <div key={index}>
            <Link href={baseRouteUrl + 'home'} shallow={true}>
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            </Link>
          </div>

        ))}
      </List>
    </div>
  );

  useEffect(() => {
    if (userCookie) {
      setUserData(userCookie)
    }
  }, [userCookie])

  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showUserRegModal, setShowUserRegModal] = useState(true);
  const [openUserRegistrationModalOnBtnClick, setOpenUserRegistrationModalOnBtnClick] = useState(false);
  const [userData, setUserData] = useState(userCookie);

  const openGenderModal = () => {
    setShowGenderModal(true);
  };

  const closeGenderModal = () => {
    setShowGenderModal(false);
  };


  const openUserRegModal = () => {
    setShowUserRegModal(true);
  };

  const closeUserRegModal = () => {
    setShowUserRegModal(false);
  };

  const handleListItemClick = (value) => {
    dispatch(updateGenderStatus(value));
    dispatch(showSuccess('Gender Filter changed successfully'))
    setCookie("gdr", value, {
      path: "/",
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Expires after 1hr
      sameSite: true,
    })
  };

  const onLoginClose = (user) => {
    setUserData(user);
    setOpenUserRegistrationModalOnBtnClick(false)
  }

  return (
    <div className="mainheaderblock">
      <div className="logo">
        <Link href={baseRouteUrl + 'home'} shallow={true}>
          <img
            src={storeData ? storeData.logo : 'https://devourin.com/images/logo2.png'}
            title="logo"
            alt="logo"
          />
        </Link>
      </div>
      <div className="hamburger" onClick={(e) => toggleDrawer(e)}>
        <Button >
          <DehazeIcon />
        </Button>
      </div>
      <div className="callheader">
        <a href={`tel:+91 ${storeMetaData.phone}`}>
          <img src={gender === 'female' ? "/assets/Icons/call_icon.png" : "/assets/Icons/call_icon.png"} />
        </a>
      </div>
      {/* <div className="selmalefemale" >
        <Button onClick={() => handleListItemClick('male')}>
          <img src={gender === 'male' ? "/assets/Icons/nav_male_icon_sel.png" : "/assets/Icons/nav_male_icon.png"} />
        </Button>
      </div>
      <div className="selmalefemale"  >
        <Button onClick={() => handleListItemClick('female')}>
          <img src={gender === 'female' ? "/assets/Icons/nav_female_icon_sel.png" : "/assets/Icons/nav_female_icon.png"} />
        </Button>
      </div> */}


      {/* 
      <div className="selmalefemale">
        <Button onClick={openGenderModal}>
          <img src={gender == 'male' ? '/assets/Icons/nav_male_icon.png' : gender == 'female' ? '/assets/Icons/nav_female_icon.png' : '/assets/Icons/both_nav_icon.png'} />
        </Button>
      </div> */}

      {/* <div className="selmalefemale">
        <Button onClick={openGenderModal}>
          <img src={gender == 'male' ? '/assets/Icons/nav_male_icon.png' : gender == 'female' ? '/assets/Icons/nav_female_icon.png' : '/assets/Icons/both_nav_icon.png'} />
        </Button>
      </div> */}

      {/* <div className="selmalefemale">
        <Button onClick={openUserRegModal}>
          <img src={gender == 'male' ? '/assets/Icons/nav_male_icon.png' : '/assets/Icons/nav_female_icon.png'} />
        </Button>
      </div> */}

      <Drawer anchor={"right"} open={isOpen} onClose={(e) => toggleDrawer(e)}>
        <div className="drawclose" onClick={(e) => toggleDrawer(e)}><img src={`/assets/Icons/${gender}/cancel_btn.png`} /></div>
        <div className="drawgraphic"><img src="/assets/Icons/graphic.jpg" /></div>
        {userData ? <div className="drawname">{userData.firstName}</div> :
          <div onClick={() => setOpenUserRegistrationModalOnBtnClick(true)} className="drawname">Sign up/Log in</div>
        }
        <div className="drawnumber">{userData ? userData.mobileNo : ''}</div>
        <div className="drawmenu">
          {list("right")}
        </div>
      </Drawer>

      {showGenderModal && <GenderModal onClose={closeGenderModal} open={showGenderModal} gender={gender} />}
      {windowRef && <UserRegistrationModal onClose={closeUserRegModal} open={showUserRegModal} openStatus={true} />}
      {openUserRegistrationModalOnBtnClick && <UserRegistrationModalAtCart onLoginClose={(e) => onLoginClose(e)} open={true} heading={'Login/Signup'} />}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    gender: state.gender,
    storeData: state?.store?.storeData,
    storeMetaData: state?.store?.storeMetaData
  }
}

export default connect(mapStateToProps)(MainHeader);
