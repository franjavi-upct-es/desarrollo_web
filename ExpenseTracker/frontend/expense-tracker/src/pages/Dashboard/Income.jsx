import React, { useEffect } from 'react'
import DashboardLayout from "../../components/layouts/DashboardLayout"
import { useState } from 'react'
import IncomeOverview from '../../components/Income/IncomeOverview'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import { toast } from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';

const Income = () => {
  useUserAuth();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  // Get All Income Details 
  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );

      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("Ha ocurrido algo. Inténtalo de nuevo, por favor.", error)
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Income
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    if (!source.trim()) {
      toast.error("Source is required")
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.")
      return;
    }

    if (!date) {
      toast.error("Date is required.")
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      });

      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error adding income:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Delete Income
  const deleteIncome = async (id) => { 
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("El ingreso se ha eliminado correctamente.");
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error eliminando el ingreso:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Handle download income details 
  const handleDownloadIncomeDetails = async () => { };

  useEffect(() => {
    fetchIncomeDetails();

    return () => { };
  }, []);

  return (
    <DashboardLayout activeMenu="Ingresos">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          <IncomeList
            transactions={incomeData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Añadir Ingreso"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal
        isOpen={openDeleteAlert.show}
        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
        title="Eliminar Ingreso"
        >
          <DeleteAlert
          content="¿Estás seguro de que quieres eliminar este ingreso?"
          onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Income
