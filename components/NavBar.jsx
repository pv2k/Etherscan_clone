import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from "axios";
import { MdOutlineClose } from "react-icons/md";
import { TbChartArrowsVertical } from "react-icons/tb";

import Style from "../styles/NavBar.module.css";
import avatar from "../avatar.png";
import etherLogo from "../eth.png";
import logo from "../logo.png";
import logoTop from "../footerLogo.png";

const NavBar = () => {
    const [userAccount, setUserAccount] = useState("");
    const [balance, setBalance] = useState("");
    const [count, setCount] = useState("");
    const [openModel, setOpenModel] = useState(true);
    const [price, setPrice] = useState([]);
    const [etherSupply, setEtherSupply] = useState([]);
    const [updatePriceData, setUpdatePriceData] = useState("");
    
    /**
     * @dev Get Ether Price
     */
    const getEtherPrice = async() => {
        try {
            const ETH_API_KEY = "XRDXU73HEPV91Z5483NQSZV1WZDSKA1NYQ";
            axios.get(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ETH_API_KEY}`)
            .then((response) => {
                // console.log(response.data.result);
                setPrice(response.data.result);
                const timeStamp = Number(response.data.result.ethusd_timestamp);
                const date = new Date(timeStamp);
                setUpdatePriceData(
                    "Updated Time: " + 
                    date.getHours() + 
                    ":" + 
                    date.getMinutes() + 
                    ":" + 
                    date.getSeconds()
                );
                // console.log(updatePriceData);
            });

            axios.get(
                `https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=${ETH_API_KEY}`
            ).then((response) => {
                setEtherSupply(response.data.result);
            });
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * @dev Metamask Connection function
     */
    const checkWalletExists = async() => {
        try {
            if(!window.ethereum){
                console.log("Please install Metamask");
                return;
            }
            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            });
            console.log(accounts);
            if(accounts.length) {
                setUserAccount(accounts[0]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * @dev connect Metamask wallet
     */
    const connectWallet = async() => {
        try {
            if(!window.ethereum){
                console.log("Please install Metamask");
                return;
            }
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            });
            if(accounts.length){
                setUserAccount(accounts[0]);
            } else{
                console.log("Please open a metamask account");
            }
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * @dev User info box
     */
    const userLoginInfo = async() => {
        if(openModel) {
            setOpenModel(false);
        } else {
            setOpenModel(true);
        }
    }

    useEffect(() => {
        checkWalletExists();
        getEtherPrice();
    }, [])
    

  return (
    <div>
        <div className={Style.navbar}>
            <div className={Style.navbar_container}>
                <div className={Style.left}>
                    <Link href="/">
                        <div>
                            <h1 className={Style.desktop}>Ether Scan</h1>
                            <h1 className={Style.mobile}>
                                <Image src={logoTop} alt="logo" width={50} height={50}/>
                            </h1>
                        </div>
                    </Link>
                </div>

                <div className={Style.right}>
                    {userAccount.length ? (
                        <div className={Style.connected}>
                            <button onClick={() => userLoginInfo()}>
                                Account: {userAccount.slice(0,9)}...
                            </button>
                            {
                                openModel ? (
                                    <div className={Style.userModal}>
                                        <div className={Style.user_box}>
                                            <div className={Style.closeBtn}>
                                                <MdOutlineClose onClick={() => userLoginInfo()} />
                                            </div>
                                            <Image src={avatar} alt="Avatar" width={50} height={50} />
                                            <p>Acc: {userAccount} ETH</p>
                                            <p>Balance: {balance} ETH</p>
                                            <p>Total Transaction: count </p>
                                        </div>
                                    </div>
                                ): (
                                    ""
                                )
                            }
                        </div>
                    ) : (
                        <button onClick={() => connectWallet()}>
                            Connect Wallet
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default NavBar