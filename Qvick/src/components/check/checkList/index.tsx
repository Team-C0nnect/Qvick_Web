import { useEffect, useState } from "react";
import { ListType } from "src/types/check/check.types";
import { qvickV1Axios } from "src/libs/auth/CustomAxios";
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AxiosError } from 'axios';
import styled from "styled-components";
import 'src/assets/scss/checkList/style.scss';

const StyledDatePicker = styled(DatePicker)`
    width: 200px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    margin-bottom: 20px;
`;

const CheckList = () => {
    const [checkList, setCheckList] = useState<ListType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [filteredCheckList, setFilteredCheckList] = useState<ListType[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const fetchCheckList = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await qvickV1Axios.get(`user-admin/check`, {
                params: { page: 1, size: 10000 },
            });

            const sortedData = response.data.data.sort((a: ListType['data'], b: ListType['data']) => parseInt(a.stdId) - parseInt(b.stdId)); // 학번 기준 정렬
            setCheckList(sortedData.map((item: ListType['data']) => ({ data: item })));
            console.log("성공", sortedData);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("실패", axiosError);
            setError(axiosError);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCheckList();
    }, []);

    useEffect(() => {
        if (selectedDate && checkList.length > 0) {
            const formattedSelectedDate = selectedDate.toISOString().split('T')[0];
            const filteredList = checkList.filter((item) =>
                item.data.checkedDate.startsWith(formattedSelectedDate)
            );
            setFilteredCheckList(filteredList);
        }
    }, [selectedDate, checkList]);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const exportToExcel = () => {
        const dataForExcel = filteredCheckList.map(({ data: { stdId, name, room, checkedDate, checked } }) => ({ stdId, name, room, checkedDate, checked }));
        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Members');
        XLSX.writeFile(workbook, '출석자.xlsx');
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading data: {(error as AxiosError).message}</p>;
    }

    return (
        <div className="main-wrap">
            <h1 className="title">출석인원 관리</h1>
            <button className="excel-button" onClick={exportToExcel}>Excel</button>
            <StyledDatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                placeholderText="날짜를 선택하세요"
            />
            <div className="list-wrap">
                <thead className="thead">
                    <tr className="thead-tr">
                        <th>학번</th>
                        <th>이름</th>
                        <th>기숙사</th>
                        <th>출석시간</th>
                    </tr>
                </thead>
                <table className="table">
                    <tbody className="tbody">
                        {Array.isArray(filteredCheckList) && filteredCheckList.length > 0 ? (
                            filteredCheckList.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.data.stdId}</td>
                                    <td>{item.data.name}</td>
                                    <td>{item.data.room}호</td>
                                    <td>{new Date(item.data.checkedDate).toLocaleTimeString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5}>데이터가 존재하지 않습니다</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CheckList;