import { toast } from 'sonner'

export default function ToastLogManyErrror(error: any) {
    return toast.error(error.response.data.message, {
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
