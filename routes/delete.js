const router = require("./auth");

router.delete("/:parentId/delete", authenticateToken, (req,res)=>{
    const requestedParentId = parseInt(req.params.parentId, 10);
    const parentId = req.user.role === "parent" ? req.user.id : requestedParentId;
    if (req.user.role === "parent" && parentId !== req.user.id) {
        return res.status(403).json({
            message:"Forbidden"
        })
    }
    const sql = "DELETE FROM Parents WHERE id = ?"
;
db.query(sql, [parentId],(err, result)=>{
    if (err){
        console.error("Error deleting parent:", err);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
    if (result.affectedRows === 0){
        return res.status(404).json({
            message:"Parent not found"
        })
    }
    res.json({
        message:"Parent deleted successfully"
    })

})})
