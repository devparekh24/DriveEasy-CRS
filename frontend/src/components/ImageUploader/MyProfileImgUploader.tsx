import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { GetProp, UploadFile } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


interface ImageUploaderProps {
    onUpload: (imageUrl: string) => void;
    url: string;
}

const getAuthToken = () => JSON.parse(localStorage.getItem('user')!).token

const MyProfileImgUploader: React.FC<ImageUploaderProps> = ({ onUpload, url }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const authToken = getAuthToken();

    const customRequest = async ({ file, onSuccess, onError }: any) => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(url, {
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
            message.error(`${file.name} file upload failed.`);
            onError(error);
        }
    };

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as FileType);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const props: UploadProps = {
        name: 'image',
        customRequest,
        showUploadList: true, // Hide the default upload list
        onPreview
    };

    return (
        <ImgCrop rotationSlider>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>  Click to Upload</Button>
                {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ width: '100%', marginTop: '10px' }} />}
            </Upload>
        </ImgCrop>

    );
};

export default MyProfileImgUploader;
