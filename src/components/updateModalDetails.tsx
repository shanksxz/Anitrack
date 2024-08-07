import useGetUserMediaData from "@/hooks/useGetUserMediaData";
import { Triangle } from "react-loader-spinner";
import useUpdateUserMedia from "@/hooks/useUpdateUserMedia";
import SelectComp from "./Select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useForm, SubmitHandler } from "react-hook-form"
import { dismissToast, errorToast, loadingToast, successToast } from "@/utils";


type foo = Omit<updateAnimeVariable, 'startedAt'| 'completedAt'> & {
    startedAt?: string;
    completedAt?: string;
}

export default function UpdateModalDetails({ isOpen, setIsOpen, mediaId }: ModalProps){
    
    const { animeData, tempData, isLoading } = useGetUserMediaData({ mediaId });
    const { mutateAsync, response, status, error } = useUpdateUserMedia();

    const {
        register,
        handleSubmit,
    } = useForm<foo>({
        values: {
            mediaId: mediaId,
            status: tempData?.status || "CURRENT",
            score: tempData?.score || 0,
            progress: tempData?.progress || 0,
            repeat: tempData?.repeat || 0,
            startedAt: tempData?.startedAt?.year ? `${tempData?.startedAt?.year}-${tempData?.startedAt?.month?.toString()
                .padStart(2, "0")}-${tempData?.startedAt?.day?.toString().padStart(2, "0")}` : "",
            completedAt: tempData?.completedAt?.year ? `${tempData?.completedAt?.year}-${tempData?.completedAt?.month?.toString()
                .padStart(2, "0")}-${tempData?.completedAt?.day?.toString().padStart(2, "0")}` : "",
        }
    })

    const onSubmit: SubmitHandler<foo> = async (data) => {

        

        // convert date to object
        const startedAt = data.startedAt ? {
            year: Number(data.startedAt.split("-")[0]),
            month: Number(data.startedAt.split("-")[1]),
            day: Number(data.startedAt.split("-")[2]),
        } : undefined

        const completedAt = data.completedAt ? {
            year: Number(data.completedAt.split("-")[0]),
            month: Number(data.completedAt.split("-")[1]),
            day: Number(data.completedAt.split("-")[2]),
        } : undefined

        try {
            loadingToast();
            await mutateAsync({
                ...data,
                startedAt,
                completedAt,
            })
            dismissToast();
            if(response?.SaveMediaListEntry == null) {
                errorToast();
            }
            successToast();
            // print response
            console.log({ response, status, error })
        } catch (error) {
            errorToast();
            console.log("error in updating data")
        }
    }

    return (
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
            <DialogContent className="p-0 rounded-none">
                {isLoading ? (
                    <div className="p-10 flex justify-center items-center">
                        <Triangle height={50} width={50} color="#02a9ff" />
                    </div>
                ) : (
                    <div className="relative">
                        <div className="relative h-[120px]">
                            <img
                                src={animeData?.bannerImage}
                                alt=""
                                className="w-full h-full opacity-30 object-cover"
                            />
                            <div className="absolute top-5 left-5 flex items-center">
                                <img
                                    src={animeData?.coverImage}
                                    alt=""
                                    className="rounded-sm"
                                />
                                <p className="text-[1.2rem] text-primary_text font-bold ml-2">
                                    {animeData?.title}
                                </p>
                            </div>
                        </div>
                        <form className="mt-[4rem] mb-5 grid grid-cols-3 items-end gap-2 px-5" onSubmit={handleSubmit(onSubmit)} >
                            {/* //TODO: Add input validation here */}
                            <Label>
                                Status
                                <SelectComp
                                    {...register("status")}
                                    options={[
                                        { value: "CURRENT", label: "Current" },
                                        { value: "COMPLETED", label: "Completed" },
                                        { value: "PLANNING", label: "Planning" },
                                        { value: "DROPPED", label: "Dropped" },
                                    ]}
                                    value="CURRENT"
                                />
                            </Label>
                            <Label>
                                Score
                                <Input
                                    type="number"
                                    step={0.1}
                                    {...register("score", {
                                        required : true,
                                        min : 0,
                                        max : 10,
                                    })}
                                />
                            </Label>
                            <Label>
                                Episodes
                                <Input
                                    type="number"
                                    {...register("progress", {
                                        required : true
                                    })}
                                />
                            </Label>
                            <Label>
                                Repeat
                                <Input
                                    type="number"
                                    {...register("repeat", {
                                        required : true
                                    })}
                                />
                            </Label>
                            <Label>
                                Started At
                                <Input
                                    type="date"
                                    {...register("startedAt", {
                                        required : true
                                    })}
                                />
                            </Label>
                            <Label>
                                Completed At
                                <Input
                                    type="date"
                                    {...register("completedAt", {
                                        setValueAs: (v) => {
                                            // return new Date(v).toISOString()
                                            // return in object format like this { year: 2021, month: 10, day: 10 }
                                            return v
                                        }
                                    })}
                                />
                            </Label>
                            <Button type="submit">
                                Update
                            </Button>
                            {/* //TODO: delete the data on anilist using this canel/del button */}
                            <Button type="button" onClick={() => setIsOpen(!isOpen)}>
                                Cancel
                            </Button>
                        </form>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

