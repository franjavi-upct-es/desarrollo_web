const xlsx = require('xlsx');
const Income = require("../models/Income");

// Add Income Source  
exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;

        // Validación: Comprueba si hay campos sin rellenar 
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "Hay que rellenar todos los campos" });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Get All Income Source  
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json(income);
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Delete Income Source  
exports.deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Ingresos eliminados con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Download Excel  
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        // Preparar los datos para Excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, 'detalles_ingresos.xlsx');
        res.download('detalles_ingresos.xlsx');
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};
