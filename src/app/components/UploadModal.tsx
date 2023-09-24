import React, { useContext, useState, useRef } from 'react';
import { MAX_FILE_SIZE_BYTES } from '../utils/CONSTANTS';

import { UploadContext, UploadContextType } from '../contexts/UploadContext';

import Loader from './Loader';

import { UploadModalStyles } from '../styles/UploadModalStyles';

export type PresignedPostUrlResponse = {
    url: string;
    fields: {
        bucket: string;
        key: string;
        Policy: string;
        "X-Amz-Algorithm": string;
        "X-Amz-Credential": string;
        "X-Amz-Date": string;
        "X-Amz-Signature": string;
    };
};

const UploadModal = () => {
    const { 
        isUploadModalOpen,
        handleModalClose
    } = useContext(UploadContext) as UploadContextType;

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);


    function handleFileInput(event: React.FormEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        const files = target.files as FileList;

        console.log('files', files)

        if (files[0]) {
            const [type] = files[0].type.split('/');
            if (!type || type !== 'image') {
                setError('Selected file is not an image');
                setSelectedFile(null)
                return;
            }

            if (files[0].size > MAX_FILE_SIZE_BYTES) {
                setError('File size is too large. Maximum allowed size is 10 MB');
                setSelectedFile(null)
                return;
            }

            setSelectedFile(files[0])
            setError(null);
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!selectedFile) {
            return;
        }

        console.log('selectedFile.name', selectedFile.name)

        try {
            setIsLoading(true);

            // First get Pre-signed POST URL
            const response = await fetch(process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT as string, 
            {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fileName: selectedFile.name
                })
            })
            
            const presignedPost: PresignedPostUrlResponse = await response.json()

            console.log('responseJSON', presignedPost)

            // Then use URL to upload file
            const formData = new FormData();
            Object.entries(presignedPost.fields).forEach(([k, v]) => {
                formData.append(k, v);
            });
            formData.append('file', selectedFile); 

            const s3Response = await fetch(presignedPost.url, 
            {
                method: "POST",
                body: formData
            })

            console.log('s3Rsponse', s3Response)
        
            setUploadSuccess(true)

        } catch(err) {
            console.log(err)
            setError('Upload Failed')
        }

        setIsLoading(false);
    }

    function uploadReset() {
        setSelectedFile(null)
        setUploadSuccess(false);

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }



    if (!isUploadModalOpen) {
        return null;
    }

    return (
        <UploadModalStyles
            onClick={handleModalClose}
        >
            <dialog
                onClick={e => {
                    e.stopPropagation();
                }} 
            >
                <h2>Upload Image</h2>

                {
                    isLoading && !uploadSuccess &&
                    <div 
                        data-testid='uploadloader'
                        className='loader-wrapper'
                    >
                        <Loader />
                    </div>
                }

                {
                    uploadSuccess &&
                    <div 
                        data-testid='successmessage'
                        className='loader-wrapper'
                    >
                        <p className='success'>Upload successful! Your image will be reviewed as soon as possible.</p>

                        <button
                            data-testid='successconfirm'
                            onClick={uploadReset}
                        >Confirm</button>
                    </div>
                }


                {
                    error !== null &&
                    <p data-testid='uploaderror' className='error'>{error}</p>
                }

                <form
                    onSubmit={handleSubmit}
                >
                    <input 
                        data-testid="input"
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileInput}
                        disabled={isLoading}
                        ref={inputRef}
                    />

                    {
                        selectedFile !== null &&
                        <>
                            <picture>
                                <img 
                                    data-testid='uploadpreview'
                                    src={URL.createObjectURL(selectedFile)}
                                />
                            </picture>

                            <button 
                                data-testid='uploadsubmit'
                                type="submit"
                                disabled={isLoading}
                            >Submit</button>
                        </>
                    }

                   
                </form>
            </dialog>
        </UploadModalStyles>
    )
}

export default UploadModal;
