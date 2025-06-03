import React, { useEffect } from 'react'
import DashboardLayout from "../../components/layouts/DashboardLayout"
import { useState } from 'react'
import ExpenseOverview from '../../components/Expense/ExpenseOverview'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Modal from '../../components/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import { toast } from 'react-hot-toast';
import ExpenseList from '../../components/Expense/ExpenseList.jsx';
import DeleteAlert from '../../components/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  // Get All Expense Details 
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Ha ocurrido algo. Inténtalo de nuevo, por favor.", error)
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    if (!category.trim()) {
      toast.error("La categoría es requerida")
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("La cantidad debe ser un número válido mayor que 0.")
      return;
    }

    if (!date) {
      toast.error("La fecha es requerida")
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success("Gasto añadido correctamente.");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error añadiendo el gasto:",
        error.response?.data?.message || error.message
      );
      toast.error("Error añadiendo el gasto. Inténtalo de nuevo.");
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("El gasto se ha eliminado correctamente.");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error eliminando el gasto:",
        error.response?.data?.message || error.message
      );
      toast.error("Error eliminando el gasto. Inténtalo de nuevo.");
    }
  };

  // Handle download expense details 
  const handleDownloadExpenseDetails = async () => { };

  useEffect(() => {
    fetchExpenseDetails();

    return () => { };
  }, []);

  return (
    <DashboardLayout activeMenu="Gastos">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Añadir Gasto"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Eliminar Gasto"
        >
          <DeleteAlert
            content="¿Estás seguro de que quieres eliminar este gasto?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Expense
