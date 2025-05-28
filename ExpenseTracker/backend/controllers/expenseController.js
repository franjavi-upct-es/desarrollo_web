const xlsx = require('xlsx');
const Expense = require("../models/Expense");

// Add Expense Source  
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        // Validación: Comprueba si hay campos sin rellenar 
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "Hay que rellenar todos los campos" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Get All Expense Source  
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Delete Expense Source  
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Gastos eliminados con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Download Excel  
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        // Preparar los datos para Excel
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, 'detalles_gastos.xlsx');
        res.download('detalles_gastos.xlsx');
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};
