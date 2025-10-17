import type { AxiosError } from 'axios'
import { toast } from 'sonner'

export default function ToastLogManyErrror(error: AxiosError | any) {
    if (error.status == 404) {
        return toast.error(error?.response?.data?.message || 'Không tìm thấy tài nguyên')
    }
    if (error.status == 400) {
        return toast.error(error?.response?.data?.message, {
            description: (
                <div>
                    {error.response.data.errors.map((item: string) => (
                        <p>+ {item}</p>
                    ))}
                </div>
            ),
            duration: 5000,
        })
    }
}
