import ProtectedRoute from "@/components/ProtectedRoute"
export default function cartPage(){
    return(
        <ProtectedRoute>
            <div>This is cart page.</div>
        </ProtectedRoute>
        
    )
}