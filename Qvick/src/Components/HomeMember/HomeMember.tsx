import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import axios from 'axios';
import Head from "src/Components/Head/Head/Head";
import SideBar from "src/Components/SideBar/Sidebar";
import Back from "src/Components/Back/Back";
import * as S from "src/Components/HomeMember/HomeMember.Style";

export default function HomeMember() {
    return (
        <S.HomeMemberWrap>
            <Head />
            <SideBar />
            <Back />
        </S.HomeMemberWrap>
    );
}
