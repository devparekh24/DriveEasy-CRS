import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';

interface ImageUploaderProps {
    onUpload: (imageUrl: string) => void;
    carId: string;
}

const getAuthToken = () => JSON.parse(localStorage.getItem('user')!).token

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, carId }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const authToken = getAuthToken();

    const customRequest = async ({ file, onSuccess, onError }: any) => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`http://localhost:8000/cars/${carId}/img-upload`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                body: formData,
            });

            if (response.ok) {
                const responseData = await response.json();
                const uploadedImageUrl = responseData.url;
                setImageUrl(uploadedImageUrl);
                onUpload(uploadedImageUrl);
                message.success(`${file.name} file uploaded successfully`);
                onSuccess();
            } else {
                const errorData = await response.json();
                message.error(`${file.name} file upload failed: ${errorData.message}`);
                onError(errorData);
            }
        } catch (error) {
            console.error('Error during image upload:', error);
            message.error(`${file.name} file upload failed.`);
            onError(error);
        }
    };

    const props: UploadProps = {
        name: 'image',
        customRequest,
        showUploadList: false, // Hide the default upload list
    };

    return (
        <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
            {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ width: '100%', marginTop: '10px' }} />}
        </Upload>
    );
};

export default ImageUploader;
